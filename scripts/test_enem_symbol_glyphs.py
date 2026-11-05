import unittest
from lib.enem_symbol_glyphs import normalize_symbol_glyphs

class SymbolGlyphs(unittest.TestCase):
    def test_only_verified_symbol_font_characters_are_normalized(self):
        self.assertEqual(normalize_symbol_glyphs('\uf02b 2 NaOH \uf02d1', 'ABC+Symbol'), '+ 2 NaOH −1')
        self.assertEqual(normalize_symbol_glyphs('αβγθπ \uf02b', 'SymbolMT'), 'αβγθπ +')
        self.assertEqual(normalize_symbol_glyphs('\uf02b', 'Arial'), '\uf02b')
        self.assertEqual(normalize_symbol_glyphs('− + → x²', 'Symbol'), '− + → x²')

if __name__ == '__main__':unittest.main()
