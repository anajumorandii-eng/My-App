import unittest
from lib.enem_page_boundaries import is_essay_page

class EssayBoundaries(unittest.TestCase):
    def test_standalone_writing_page(self):
        for title in ['PROPOSTA DE REDAÇÃO','INSTRUÇÕES PARA A REDAÇÃO','Proposta de redacao','Transcreva a sua Redação para a Folha de Redação.']:
            self.assertTrue(is_essay_page([{'text':title},{'text':'TEXTOS MOTIVADORES'}]))

    def test_real_question_quoting_writing_instructions_is_kept(self):
        self.assertFalse(is_essay_page([{'text':'QUESTÃO 45'},{'text':'PROPOSTA DE REDAÇÃO'}]))
        self.assertFalse(is_essay_page([{'text':'Leia a proposta de redação abaixo.'}]))
        self.assertFalse(is_essay_page([{'text':'TEXTOS MOTIVADORES'}]))

if __name__=='__main__':unittest.main()
