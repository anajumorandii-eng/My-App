import importlib.util
import json
import tempfile
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('transcrever', Path(__file__).with_name('transcrever-enunciados.py'))
transcrever = importlib.util.module_from_spec(spec)
spec.loader.exec_module(transcrever)


class TranscricaoTest(unittest.TestCase):
    def test_ocr_sem_idioma_nao_produz_rascunho_vazio_com_sucesso(self):
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory) / 'page.png'
            transcrever.Image.new('RGB', (40, 40), 'white').save(image)
            with patch.dict(transcrever.AMBIENTE, {'TESSDATA_PREFIX': directory}):
                with self.assertRaises(subprocess.CalledProcessError):
                    transcrever.palavras_ocr(str(image))

    def test_continuacao_compartilhada_entra_uma_vez_em_cada_questao(self):
        def word(t, x, y):
            return {'t': t, 'x': x, 'y': y, 'x1': x + 1, 'h': 10}
        words = [word('rodapé', 0, 0),
                 word('Para responder às questões de 1 a 3, leia:', 5, 100),
                 word('Começo do texto.', 5, 120),
                 word('Continuação do texto.', 75, 100), word('Última linha.', 75, 120)]
        for number in range(1, 4):
            y = 200 + number * 50
            words += [word('QUESTÃO', 75, y), word(str(number), 85, y),
                      word(f'Pergunta {number}?', 75, y + 20)]
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'scripts/data').mkdir(parents=True)
            (root / 'scripts/data/test-source.json').write_text(json.dumps({
                'idPrefix': 'teste', 'media': [{'page': 1, 'url': '/test.webp'}]}))
            output = root / 'output.json'
            with patch.object(transcrever, 'RAIZ', directory), patch.object(transcrever, 'palavras_ocr', return_value=(words, 100)):
                transcrever.main(['test', 'ocr', str(output)])
            statements = json.loads(output.read_text())
            self.assertEqual(len(statements), 3)
            for number in range(1, 4):
                text = statements[f'teste_q{number:02d}']
                self.assertEqual(text.count('Continuação do texto.'), 1)
                self.assertIn(f'Pergunta {number}?', text)
                self.assertNotIn(f'Pergunta {number % 3 + 1}?', text)


if __name__ == '__main__':
    unittest.main()
