import unittest
from lib.enem_page_boundaries import is_essay_page, is_institutional_footer

class EssayBoundaries(unittest.TestCase):
    def test_standalone_writing_page(self):
        for title in ['PROPOSTA DE REDAÇÃO','INSTRUÇÕES PARA A REDAÇÃO','Proposta de redacao','Transcreva a sua Redação para a Folha de Redação.']:
            self.assertTrue(is_essay_page([{'text':title},{'text':'TEXTOS MOTIVADORES'}]))

    def test_real_question_quoting_writing_instructions_is_kept(self):
        self.assertFalse(is_essay_page([{'text':'QUESTÃO 45'},{'text':'PROPOSTA DE REDAÇÃO'}]))
        self.assertFalse(is_essay_page([{'text':'Leia a proposta de redação abaixo.'}]))
        self.assertFalse(is_essay_page([{'text':'TEXTOS MOTIVADORES'}]))

    def test_footer_requires_complete_institutional_label(self):
        self.assertTrue(is_institutional_footer('CH 1º dia | Caderno 2 - AMARELO - Página 23'))
        self.assertFalse(is_institutional_footer('A autora cita a página 23 do caderno.'))
        self.assertFalse(is_institutional_footer('CH 1º dia | Caderno 2 - AMARELO - Página 23 — analise o texto'))

if __name__=='__main__':unittest.main()
