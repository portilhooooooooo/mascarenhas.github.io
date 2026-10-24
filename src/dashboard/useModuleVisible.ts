import {useEffect,useState} from 'react';
export function useModuleVisible(id:string){
 const read=()=>document.getElementById(id)?.classList.contains('active')===true && !document.hidden;
 const [visible,setVisible]=useState(read);
 useEffect(()=>{const host=document.getElementById(id);const sync=()=>setVisible(read());const observer=new MutationObserver(sync);if(host)observer.observe(host,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',sync);sync();return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);};},[id]);
 return visible;
}
