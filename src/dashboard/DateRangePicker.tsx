import {useEffect,useRef,useState} from 'react';
import {CalendarDays,ChevronLeft,ChevronRight} from 'lucide-react';
import './DateRangePicker.css';

type Props={start:string;end:string;onChange:(start:string,end:string)=>void;label?:string};
const iso=(d:Date)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const show=(v:string)=>v?v.slice(8,10)+'/'+v.slice(5,7)+'/'+v.slice(0,4):'…';
export function DateRangePicker({start,end,onChange,label='Período'}:Props){
 const [open,setOpen]=useState(false);
 const [draftStart,setDraftStart]=useState(start);
 const [draftEnd,setDraftEnd]=useState(end);
 const [cursor,setCursor]=useState(()=>new Date((start||iso(new Date())).slice(0,7)+'-01T12:00:00'));
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!open)return;const close=(e:MouseEvent)=>{if(root.current&&!root.current.contains(e.target as Node))setOpen(false)};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[open]);
 const first=new Date(cursor.getFullYear(),cursor.getMonth(),1,12);
 const offset=(first.getDay()+6)%7;
 const days=Array.from({length:Math.ceil((offset+new Date(first.getFullYear(),first.getMonth()+1,0).getDate())/7)*7},(_,i)=>new Date(first.getFullYear(),first.getMonth(),i-offset+1,12));
 const choose=(v:string)=>{if(!draftStart||draftEnd||v<draftStart){setDraftStart(v);setDraftEnd('')}else{setDraftEnd(v);onChange(draftStart,v);setOpen(false)}};
 return <div className="mba-date-range" ref={root}>
  <span className="mba-date-range-label">{label}</span>
  <button type="button" className="mba-date-range-trigger" aria-expanded={open} aria-label={label+': '+show(start)+' até '+show(end)} onClick={()=>{setDraftStart(start);setDraftEnd(end);setCursor(new Date((start||iso(new Date())).slice(0,7)+'-01T12:00:00'));setOpen(!open)}}><CalendarDays size={14}/><span>{start||end?show(start)+' — '+show(end):'Todas as datas'}</span></button>
  {open&&<div className="mba-date-range-popover" role="group" aria-label="Calendário de intervalo">
   <header><button type="button" aria-label="Mês anterior" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()-1,1,12))}><ChevronLeft size={16}/></button><strong>{new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(cursor)}</strong><button type="button" aria-label="Próximo mês" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()+1,1,12))}><ChevronRight size={16}/></button></header>
   <div className="mba-date-range-grid">{['S','T','Q','Q','S','S','D'].map((day,i)=><span className="mba-date-weekday" key={i}>{day}</span>)}{days.map((d,i)=>{const v=iso(d);const selected=v===draftStart||v===draftEnd;const between=!!draftStart&&!!draftEnd&&v>draftStart&&v<draftEnd;return <button key={i} type="button" aria-label={show(v)} aria-pressed={selected} className={(d.getMonth()!==cursor.getMonth()?'other ':'')+(selected?'selected ':'')+(between?'between':'')} onClick={()=>choose(v)}>{d.getDate()}</button>})}</div>
   <footer><span>{draftStart?show(draftStart)+' — '+(draftEnd?show(draftEnd):'Selecione o fim'):'Selecione o início'}</span><button type="button" onClick={()=>{onChange('','');setOpen(false)}}>Limpar</button></footer>
  </div>}
 </div>;
}
