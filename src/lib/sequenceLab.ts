export type SequenceConfigId='pa'|'pg';
export interface SequenceReadout{label:string;value:string;pivot?:boolean}
export interface SequenceConfig{id:SequenceConfigId;name:string;question:string;control:{label:string;description:string;min:number;max:number;step:number;initial:number};formula:string;insight:string;readouts(value:number):SequenceReadout[]}
const f=(n:number)=>String(Math.round(n*100)/100).replace('.',',').replace('-', '−');
export const SEQUENCE_CONFIGS:Record<SequenceConfigId,SequenceConfig>={
 pa:{id:'pa',name:'PA avança por uma diferença fixa',question:'Mude a razão r e compare os próximos termos a partir de a₁ = 3.',control:{label:'r',description:'diferença somada a cada termo',min:-3,max:6,step:1,initial:2},formula:'aₙ = a₁ + (n − 1)r',insight:'em PA, olhar a diferença entre vizinhos revela a regra; a razão não é uma divisão.',readouts:r=>[{label:'a₂ − a₁',value:f(r)},{label:'a₃ − a₂',value:f(r)},{label:'a₅',value:f(3+4*r),pivot:true}]},
 pg:{id:'pg',name:'PG avança por uma razão multiplicativa',question:'Mude a razão q e compare os próximos termos a partir de a₁ = 3.',control:{label:'q',description:'fator multiplicado a cada termo',min:-2,max:4,step:1,initial:2},formula:'aₙ = a₁ · qⁿ⁻¹',insight:'em PG, a divisão entre vizinhos revela a regra; uma diferença constante não é exigida.',readouts:q=>[{label:'a₂ / a₁',value:f(q)},{label:'a₃ / a₂',value:q===0?'indefinida':f(q)},{label:'a₅',value:f(3*q**4),pivot:true}]},
};
