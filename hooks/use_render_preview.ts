import { useMemo } from 'react';

export function useRenderPreview(previewContract: Record<string, any>, target: 'html' | 'remotion' = 'html') {
  return useMemo(() => ({
    target,
    deterministic: true,
    preview_model: {
      request_id: previewContract.request_id,
      scenes: previewContract.scene_graph?.scenes ?? [],
      timeline: previewContract.timeline?.segments ?? [],
      command_count: (previewContract.pending_commands ?? []).length,
    },
  }), [previewContract, target]);
}
