import React from 'react';
import {render,fireEvent,screen} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import {TopicScene} from './TopicScene';
import KinematicsBoard from '../visual-boards/KinematicsBoard';
import {interactiveSummaries} from '../../data/interactiveSummaries';
import {buildVisualMap} from '../../lib/visualStudy';

it('aceleração vetorial explica radial e tangencial em cada regime',()=>{
 const {container}=render(<TopicScene summaryId="summary-fisica-aceleracao-vetorial"/>);
 fireEvent.click(screen.getByRole('button',{name:'MCU'}));
 expect(container.querySelector('[data-vector="tangent-velocity"]')).not.toBeNull();
 expect(container.querySelector('[data-vector="radial-acceleration"]')).not.toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'MCUV'}));
 expect(container.querySelector('[data-vector="tangential-acceleration"]')).not.toBeNull();
});
it('dilatação mostra dimensões e diferença entre líquido e recipiente',()=>{
 const {container}=render(<TopicScene summaryId="summary-fisica-dilatacao-ou-contracao-termica-dos-solidos-e-liquidos"/>);
 for(const geometry of ['length','area','volume','liquid-container'])expect(container.querySelector(`[data-expansion="${geometry}"]`)).not.toBeNull();
 expect(container.textContent).toContain('γlíquido − γrecipiente');
});
it('forças concorrentes permanecem totalmente legíveis ao selecionar',()=>{
 const {container}=render(<TopicScene summaryId="summary-fisica-forca-e-seus-tipos"/>);
 expect(container.querySelector('g[opacity="0.27"],g[opacity="0.25"]')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Elástica'}));
 expect(container.querySelector('g[opacity="0.27"],g[opacity="0.25"]')).toBeNull();
});
it('geração diferencia reservatório, vapor, fissão e fotovoltaica',()=>{
 const {container}=render(<TopicScene summaryId="summary-fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares"/>);
 expect(container.querySelector('[data-generation="hydro"]')).not.toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Nuclear'}));
 expect(container.querySelector('[data-generation="fission-steam"]')).not.toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Solar fotovoltaica'}));
 expect(container.querySelector('[data-generation="photovoltaic"]')).not.toBeNull();
});
it('estática não apaga braços e torques dos outros casos',()=>{
 const {container}=render(<TopicScene summaryId="summary-fisica-estatica"/>);
 const panels=container.querySelectorAll('rect.qf-quadro');
 expect(panels).toHaveLength(3);
 for(const panel of panels)expect(Number((panel.parentElement as unknown as SVGElement).style.opacity)).toBe(1);
});
it('conceitos de cinemática distinguem referencial, percurso e deslocamento',()=>{
 const summary=interactiveSummaries.find(s=>s.id==='summary-fisica-cinematica-escalar-conceitos-fundamentais')!;
 const {container}=render(<KinematicsBoard map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);
 expect(container.querySelector('[data-kinematics="reference-path"]')).not.toBeNull();
 expect(container.textContent).toContain('distância = 8 m');
 expect(container.textContent).toContain('Δs = +2 m');
});
