import { useMemo, useState } from 'react';

export type EditorCommand = {
  command_id: string;
  type: 'update_scene_text' | 'update_scene_timing' | 'update_scene_layout' | 'update_narration';
  target_id: string;
  payload: Record<string, unknown>;
};

export type EditorContract = {
  request_id: string;
  scene_graph: { scenes: Array<Record<string, any>> };
  timeline: { segments: Array<Record<string, any>> };
  narration?: { lines: Array<Record<string, any>> };
  asset_manifest?: { assets: Array<Record<string, any>> };
};

function stableCommandId(index: number) {
  return `CMD-${String(index + 1).padStart(5, '0')}`;
}

export function useEditorState(initialContract: EditorContract) {
  const [contract] = useState<EditorContract>(initialContract);
  const [commands, setCommands] = useState<EditorCommand[]>([]);

  const emitCommand = (cmd: Omit<EditorCommand, 'command_id'>) => {
    setCommands((prev) => [...prev, { ...cmd, command_id: stableCommandId(prev.length) }]);
  };

  const derivedPreviewContract = useMemo(() => ({
    ...contract,
    pending_commands: commands,
  }), [contract, commands]);

  return {
    contract,
    commands,
    emitCommand,
    derivedPreviewContract,
  };
}
