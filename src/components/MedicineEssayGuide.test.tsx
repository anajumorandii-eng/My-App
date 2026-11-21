import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MedicineEssayGuide } from './MedicineEssayGuide';
import { medicineEssayGuides, vunespEssayDrills } from '../data/vunespMedicineEssayGuide';

describe('MedicineEssayGuide', () => {
  it('abre na Famerp com os quatro critérios do edital e os temas reais', () => {
    render(<MedicineEssayGuide />);
    for (const c of medicineEssayGuides.Famerp.criteria) expect(screen.getByText(c.name)).toBeTruthy();
    expect(screen.getByText(/Indústria da moda/)).toBeTruthy();
    expect(screen.getByText(/Os quatro critérios do edital/)).toBeTruthy();
  });

  it('na Unifesp avisa que os critérios não foram confirmados em fonte oficial', () => {
    render(<MedicineEssayGuide />);
    fireEvent.click(screen.getByRole('tab', { name: 'Unifesp' }));
    expect(screen.getByText(/Luto contemporâneo/)).toBeTruthy();
    expect(screen.getByText(/Os quatro critérios da Vunesp/)).toBeTruthy();
    expect(screen.getByText(/não confirmada no documento oficial/)).toBeTruthy();
  });

  it('cada exercício diz quando está pronto e quanto tempo leva', () => {
    for (const d of vunespEssayDrills) {
      expect(d.doneWhen.length).toBeGreaterThan(10);
      expect(d.minutes).toBeGreaterThan(0);
    }
    expect(new Set(Object.values(medicineEssayGuides).flatMap((g) => g.themes.map((t) => `${g.board}${t.year}`))).size).toBe(10);
  });
});
