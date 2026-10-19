"""Exercise real Git races without touching GitHub or the working repository."""
import json
import os
from pathlib import Path
import shlex
import subprocess
import tempfile
import textwrap
import unittest

WORKFLOW = Path(os.environ.get('CRIVO_CONTINUITY_WORKFLOW', Path(__file__).resolve().parents[1] / '.github/workflows/continuity-state.yml'))


def git(directory, *args):
    return subprocess.check_output(['git', '-C', str(directory), *args], stderr=subprocess.PIPE, text=True).strip()


class ContinuityStateTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.remote = self.root / 'remote.git'
        self.actor = self.root / 'actor'
        self.peer = self.root / 'peer'
        subprocess.run(['git', 'init', '--bare', '--initial-branch=main', str(self.remote)], check=True, capture_output=True)
        git(self.root, 'clone', str(self.remote), str(self.actor))
        git(self.actor, 'config', 'user.name', 'Test')
        git(self.actor, 'config', 'user.email', 'test@example.invalid')
        (self.actor / 'docs').mkdir()
        (self.actor / 'docs/CONTINUIDADE-ESTADO.json').write_text('{"source_commit":"initial"}')
        git(self.actor, 'add', '.')
        git(self.actor, 'commit', '-m', 'Initial state')
        (self.actor / 'content.txt').write_text('Initial content')
        git(self.actor, 'add', '.')
        git(self.actor, 'commit', '-m', 'Study content')
        git(self.actor, 'push', '-u', 'origin', 'main')
        git(self.root, 'clone', str(self.remote), str(self.peer))
        git(self.peer, 'config', 'user.name', 'Test')
        git(self.peer, 'config', 'user.email', 'test@example.invalid')
        self.script = self.root / 'update.sh'
        blocks = WORKFLOW.read_text().split('        run: |\n')[1:]
        # The previous two-step workflow can also be used to reproduce failures.
        self.script.write_text('\n'.join(textwrap.dedent(block.split('\n      - name:')[0]) for block in blocks))

    def run_update(self):
        return subprocess.run(['bash', '-e', '-o', 'pipefail', str(self.script)], cwd=self.actor,
                              env={**os.environ, 'GITHUB_REPOSITORY': 'fixture/repo', 'SOURCE_REF': 'main',
                                   'SOURCE_SHA': git(self.actor, 'rev-parse', 'HEAD')},
                              text=True, capture_output=True, timeout=30)

    def snapshot(self):
        return json.loads(git(self.remote, 'show', 'main:docs/CONTINUIDADE-ESTADO.json'))

    def test_regenerates_after_a_concurrent_push(self):
        original = git(self.remote, 'rev-parse', 'main')
        (self.peer / 'concurrent.txt').write_text('Preserve this merge')
        git(self.peer, 'add', '.')
        git(self.peer, 'commit', '-m', 'Concurrent change')
        concurrent = git(self.peer, 'rev-parse', 'HEAD')
        marker = self.root / 'pushed'
        hook = self.actor / '.git/hooks/pre-push'
        hook.write_text(f'''#!/bin/sh
if [ ! -f {shlex.quote(str(marker))} ]; then
  touch {shlex.quote(str(marker))}
  git -C {shlex.quote(str(self.peer))} push origin main || exit 1
fi
''')
        hook.chmod(0o755)
        result = self.run_update()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(self.snapshot()['source_commit'], concurrent)
        self.assertEqual(self.snapshot()['changed_files'], ['concurrent.txt'])
        self.assertEqual(git(self.remote, 'show', 'main:concurrent.txt'), 'Preserve this merge')
        git(self.remote, 'merge-base', '--is-ancestor', original, 'main')

    def test_current_snapshot_is_a_noop(self):
        first = self.run_update()
        self.assertEqual(first.returncode, 0, first.stderr)
        head = git(self.remote, 'rev-parse', 'main')
        second = self.run_update()
        self.assertEqual(second.returncode, 0, second.stderr)
        self.assertEqual(git(self.remote, 'rev-parse', 'main'), head)

    def test_merge_lists_changes_against_first_parent(self):
        git(self.actor, 'switch', '-c', 'feature')
        (self.actor / 'feature.txt').write_text('New material')
        git(self.actor, 'add', '.')
        git(self.actor, 'commit', '-m', 'New feature')
        git(self.actor, 'switch', 'main')
        git(self.actor, 'merge', '--no-ff', 'feature', '-m', 'Merge feature')
        source = git(self.actor, 'rev-parse', 'HEAD')
        git(self.actor, 'push', 'origin', 'main')
        result = self.run_update()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.snapshot()['source_commit'], source)
        self.assertEqual(self.snapshot()['changed_files'], ['feature.txt'])

    def test_real_push_rejection_still_fails(self):
        original = git(self.remote, 'rev-parse', 'main')
        hook = self.remote / 'hooks/pre-receive'
        hook.write_text('#!/bin/sh\nexit 1\n')
        hook.chmod(0o755)
        result = self.run_update()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(git(self.remote, 'rev-parse', 'main'), original)


if __name__ == '__main__':
    unittest.main()
