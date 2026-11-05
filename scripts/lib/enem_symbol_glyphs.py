"""Repair only the verified private glyphs of the PDF Symbol fonts."""
def normalize_symbol_glyphs(text, font):
    if font.split('+')[-1] not in ('Symbol', 'SymbolMT'):
        return text
    return text.translate({0xF02B: '+', 0xF02D: '−'})
