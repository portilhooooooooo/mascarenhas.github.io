/** Only opt-in analytical reads. Auth, writes and operational queues never enter this lane. */
type ApiError = Error & {status?:number;code?:string;retryAfter?:string|null};
type Waiter={priority:number;sequence:number;signal:AbortSignal;resolve:()=>void;reject:(error:Error)=>void;abort:()=>void};
const aborted=()=>new DOMException('Consulta cancelada.','AbortError');
class AnalyticalLane {
  private active=0;
  private sequence=0;
  private queue:Waiter[]=[];
  private cooldown=0;
  private wake:ReturnType<typeof setTimeout>|undefined;
  constructor(private readonly capacity=2){}
  defer(until:number){this.cooldown=Math.max(this.cooldown,until);this.pump();}
  async acquire(priority:number,signal:AbortSignal):Promise<()=>void>{
    if(signal.aborted)throw aborted();
    await new Promise<void>((resolve,reject)=>{
      const waiter:Waiter={priority,sequence:this.sequence++,signal,resolve,reject,abort:()=>{}};
      waiter.abort=()=>{
        const index=this.queue.indexOf(waiter);
        if(index>=0){this.queue.splice(index,1);reject(aborted());this.pump();}
      };
      signal.addEventListener('abort',waiter.abort,{once:true});
      this.queue.push(waiter);this.pump();
    });
    let released=false;
    return ()=>{if(!released){released=true;this.active--;this.pump();}};
  }
  private pump(){
    if(this.wake!==undefined){clearTimeout(this.wake);this.wake=undefined;}
    if(!this.queue.length||this.active>=this.capacity)return;
    const wait=this.cooldown-Date.now();
    if(wait>0){this.wake=setTimeout(()=>this.pump(),wait);return;}
    this.queue.sort((a,b)=>a.priority-b.priority||a.sequence-b.sequence);
    while(this.active<this.capacity&&this.queue.length){
      const item=this.queue.shift()!;
      item.signal.removeEventListener('abort',item.abort);
      if(item.signal.aborted){item.reject(aborted());continue;}
      this.active++;item.resolve();
    }
  }
}
const lane=new AnalyticalLane(2);
export function retryAfterMs(value:string|null|undefined,now=Date.now()):number{
  if(!value)return 0;
  if(/^\d+(\.\d+)?$/.test(value.trim()))return Number(value)*1000;
  const at=Date.parse(value);return Number.isFinite(at)?Math.max(0,at-now):0;
}
function retryable(error:unknown):error is ApiError{
  if(!(error instanceof Error)||error.name==='AbortError')return false;
  const api=error as ApiError;
  if(['AUTH_TEMPORARILY_UNAVAILABLE','AUTH_DEPENDENCY_UNAVAILABLE','STALE_IDENTITY','STALE_ANALYTICS_SCOPE','ANALYTICS_TIMEOUT'].includes(api.code||''))return false;
  return [429,502,503,504].includes(api.status||0)||error instanceof TypeError;
}
function pause(ms:number,signal:AbortSignal):Promise<void>{
  if(signal.aborted)return Promise.reject(aborted());
  return new Promise((resolve,reject)=>{
    const abort=()=>{clearTimeout(timer);reject(aborted());};
    const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);
    signal.addEventListener('abort',abort,{once:true});
  });
}
function recoveryDelay(error:ApiError,attempt:number):number{
  return Math.max(retryAfterMs(error.retryAfter),Math.max(error.status===429?1000:0,Math.min(2000,400*2**attempt)))+Math.floor(Math.random()*200);
}
type ReadOptions={priority?:number;signal?:AbortSignal;isCurrent?:()=>boolean;budgetMs?:number};
/** One retry owner: at most 3 attempts, including capacity waiting/backoff in the total budget. */
export async function analyticalRead<T>(load:(signal:AbortSignal)=>Promise<T>,options:ReadOptions={}):Promise<T>{
  const controller=new AbortController();
  const externalAbort=()=>controller.abort();
  options.signal?.addEventListener('abort',externalAbort,{once:true});
  if(options.signal?.aborted)controller.abort();
  const budget=options.budgetMs??20000,deadline=Date.now()+budget;
  let timedOut=false;
  const timeout=setTimeout(()=>{timedOut=true;controller.abort();},budget);
  const current=()=>{
    if(controller.signal.aborted)throw aborted();
    if(options.isCurrent&&!options.isCurrent())throw Object.assign(new Error('Consulta de contexto anterior descartada.'),{code:'STALE_ANALYTICS_SCOPE'});
  };
  try{
    for(let attempt=0;;attempt++){
      current();
      const release=await lane.acquire(options.priority??1,controller.signal);
      let failure:unknown;let retryDelay=0;
      try{current();const value=await load(controller.signal);current();return value;}
      catch(error){
        failure=error;
        // Reserve the cooldown before release pumps the next queued read, even
        // when this caller has exhausted its own attempt/latency budget.
        if(retryable(error)&&error.status===429){retryDelay=recoveryDelay(error,attempt);lane.defer(Date.now()+retryDelay);}
      }
      finally{release();}
      if(attempt>=2||!retryable(failure))throw failure;
      const delay=retryDelay||recoveryDelay(failure,attempt);
      if(Date.now()+delay>=deadline)throw failure;
      await pause(delay,controller.signal);
    }
  }catch(error){
    if(timedOut&&!options.signal?.aborted)throw Object.assign(new Error('A consulta excedeu o orçamento de leitura.'),{code:'ANALYTICS_TIMEOUT',status:504});
    throw error;
  }finally{
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort',externalAbort);
  }
}
