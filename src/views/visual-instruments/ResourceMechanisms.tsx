import React from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';

/** One illustrative accounting interval, with a finite stock and no negative extraction. */
export function resourceBalance(users: number, withdrawal: number, renewal: number) {
  const initial = 60;
  const extracted = Math.min(initial + renewal, users * withdrawal);
  return { initial, extracted, final: initial + renewal - extracted };
}

export function CommonsMechanism({ scenario }: { scenario: number }) {
  const clock = useMechanismTime();
  const users = scenario === 0 ? 1 : 5;
  const withdrawal = scenario === 2 ? 2 : 8;
  const renewal = 10;
  const balance = resourceBalance(users, withdrawal, renewal);
  const stock = balance.initial + (balance.final - balance.initial) * clock.time;
  return <MechanismFrame note="Modelo contábil hipotético de um intervalo: estoque inicial de 60 unidades e reposição de 10. Sem previsão ambiental; uma regra só produz este resultado se for cumprida." controls={<>
    <h3>O estoque recebe e perde recursos.</h3>
    <p>{users} usuário(s) × {withdrawal} unidades = {balance.extracted} retiradas. A reposição acrescenta {renewal}.</p>
    <p role="status">Saldo ao final: 60 + 10 − {balance.extracted} = {balance.final} unidades. {balance.final < 60 ? 'Retiradas superam a reposição.' : balance.final === 60 ? 'Retiradas igualam a reposição.' : 'Reposição supera as retiradas.'}</p>
    <TimeControl clock={clock} label="Intervalo de uso do recurso" />
  </>}>
    <svg viewBox="0 0 520 420" role="img" aria-label={`Recurso comum: ${users} usuários, ${balance.extracted} unidades retiradas, estoque final ${balance.final}`}>
      <text x="25" y="30" className="mf-heading">REPOSIÇÃO / RETIRADAS / ESTOQUE</text>
      <path d="M130 140V340H390V140" fill="none" stroke="var(--vs-ink)" strokeWidth="4" />
      <rect x="134" y={338-stock*2.5} width="252" height={stock*2.5} fill="var(--mf-blue)" opacity=".4" />
      <path d="M130 188H390" stroke="var(--vs-ink)" strokeDasharray="5 5" />
      <text x="260" y="365" textAnchor="middle">estoque: {Math.round(stock)} unidades</text>
      <text x="260" y="398" textAnchor="middle">tracejado: estoque inicial (60)</text>
      <path d="M50 110V215H110" fill="none" stroke="var(--mf-green)" strokeWidth="5" />
      <circle cx={50+60*Math.max(0,clock.time*2-1)} cy={110+105*Math.min(1,clock.time*2)} r="7" fill="var(--mf-green)" />
      <text x="45" y="85">+10</text>
      {Array.from({length:users},(_,i)=><g key={i}>
        <circle cx={160+i*45} cy="83" r="12" fill="var(--mf-gold)" />
        <path d={`M${160+i*45} 100V145`} stroke="var(--mf-red)" strokeWidth="3" />
        <circle cx={160+i*45} cy={145-clock.time*45} r="5" fill="var(--mf-red)" />
      </g>)}
      <text x="415" y="130">−{balance.extracted}</text>
    </svg>
  </MechanismFrame>;
}

export function GoldTaxMechanism() {
  const clock = useMechanismTime();
  return <MechanismFrame note="Exemplo de alíquota: 20 partes iguais de ouro tributável, das quais 4 correspondem ao quinto. Não representa arrecadação efetiva, evasão, outros tributos ou um ano específico." controls={<>
    <h3>Quinto: uma parte em cada cinco.</h3>
    <p>O movimento separa 20% do ouro tributável para a Coroa. As outras 16 partes representam o restante após esse tributo, não lucro líquido.</p>
    <p>Casas de fundição fiscalizavam e selavam o ouro. A derrama era uma cobrança extraordinária ligada ao déficit da meta fiscal; não uma segunda alíquota de 20%.</p>
    <TimeControl clock={clock} label="Separação do quinto" />
  </>}>
    <svg viewBox="0 0 520 420" role="img" aria-label="Quinto do ouro: quatro de vinte partes para a Coroa, dezesseis partes restantes">
      <text x="25" y="30" className="mf-heading">OURO TRIBUTÁVEL / ALÍQUOTA DE 20%</text>
      <path d="M30 125V335H285V125M345 125V335H495V125" fill="none" stroke="var(--vs-ink)" strokeWidth="3" />
      <text x="155" y="92" textAnchor="middle">20 partes iniciais</text>
      <text x="420" y="92" textAnchor="middle">Coroa</text>
      {Array.from({length:20},(_,i)=>{
        const taxed=i>=16;
        const startX=60+(i%4)*55, startY=150+Math.floor(i/4)*35;
        return <rect key={i} data-taxed={taxed} x={startX+(taxed?clock.time*(365+(i-16)%2*55-startX):0)} y={startY+(taxed?clock.time*(190+Math.floor((i-16)/2)*45-startY):0)} width="35" height="22" rx="3" fill={taxed?'var(--mf-red)':'var(--mf-gold)'} stroke="var(--vs-ink)" />;
      })}
      <text x="155" y="375" textAnchor="middle">16 partes: restante</text>
      <text x="420" y="375" textAnchor="middle">4 partes: quinto</text>
    </svg>
  </MechanismFrame>;
}
