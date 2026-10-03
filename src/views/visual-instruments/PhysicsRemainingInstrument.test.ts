import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LunetaScene } from './LunetaScene';

describe('luneta de Kepler', () => {
  it('desenha feixes físicos e declara escalas separadas e aproximação', () => {
    for (const focal of [400, 1200, 1600]) {
      const html = renderToStaticMarkup(React.createElement(LunetaScene, { focal }));
      expect(html).toContain('data-luneta-length="' + (focal + 8) + '"');
      expect(html.match(/data-luneta-ray="overview"/g)).toHaveLength(3);
      expect(html.match(/data-luneta-ray="detail"/g)).toHaveLength(3);
      expect(html).toContain('12 px/mm');
      expect(html).toContain('paraxial');
      expect(html).toContain('imagem real');
    }
  });
});
