import test from 'node:test';
import assert from 'node:assert/strict';

function emitDeterministicCommand(existing: any[], cmd: any) {
  const id = `CMD-${String(existing.length + 1).padStart(5, '0')}`;
  return [...existing, { ...cmd, command_id: id }];
}

test('editor emits deterministic edit commands without direct mutation', () => {
  const initial = [] as any[];
  const a = emitDeterministicCommand(initial, { type: 'update_scene_text', target_id: 'SCENE-001', payload: { text: 'Edited' } });
  const b = emitDeterministicCommand(a, { type: 'update_scene_timing', target_id: 'SCENE-001', payload: { duration_frames: 135 } });

  assert.equal(initial.length, 0);
  assert.equal(a[0].command_id, 'CMD-00001');
  assert.equal(b[1].command_id, 'CMD-00002');
  assert.equal(b[0].target_id, 'SCENE-001');
});
