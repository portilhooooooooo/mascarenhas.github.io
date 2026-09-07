import type {ReactNode} from 'react';
import type {LabeledValue} from './carteiraService';
import {formatNumberBR} from './formatters';
export function Metric({label,value,note}:{label:string;value:string;note?:string}){return <div className="metric"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>;}
export function Panel({title,children}:{title:string;children:ReactNode}){return <section className="chart-panel"><h2>{title}</h2>{children}</section>;}
export function Bars({items}:{items:LabeledValue[]}){const max=Math.max(...items.map(i=>i.value),1);return items.length?<div className="horizontal-bars">{items.map(item=><div className="bar-row" key={item.label}><div><span>{item.label}</span><strong>{formatNumberBR(item.value)}</strong></div><div className="bar-track"><span style={{width:`${item.value/max*100}%`}}/></div></div>)}</div>:<p className="empty-state">Nenhum registro neste recorte.</p>;}
