'use client';
import React from 'react';
import { useEditorState } from '../../hooks/use_editor_state';
import { useRenderPreview } from '../../hooks/use_render_preview';
import { EditorLayout } from './editor_layout';
import { ScenePanel } from './scene_panel';
import { TimelinePanel } from './timeline_panel';
import { PreviewPanel } from './preview_panel';
import { AssetPanel } from './asset_panel';
import { NarrationPanel } from './narration_panel';

const SAMPLE_CONTRACT = {
  request_id: 'EDITOR-REQ-001',
  scene_graph: { scenes: [{ scene_id: 'SCENE-001', title: 'Intro' }, { scene_id: 'SCENE-002', title: 'Detail' }] },
  timeline: { segments: [{ scene_id: 'SCENE-001', duration_frames: 120 }, { scene_id: 'SCENE-002', duration_frames: 180 }] },
  narration: { lines: [{ scene_id: 'SCENE-001', text: 'Intro line' }, { scene_id: 'SCENE-002', text: 'Detail line' }] },
  asset_manifest: { assets: [] },
};

export default function EditorPage() {
  const { contract, emitCommand, derivedPreviewContract } = useEditorState(SAMPLE_CONTRACT as any);
  const preview = useRenderPreview(derivedPreviewContract as any, 'html');

  return (
    <EditorLayout
      left={<><h2>Scenes</h2><ScenePanel scenes={contract.scene_graph.scenes} onEditText={(sceneId, text) => emitCommand({ type: 'update_scene_text', target_id: sceneId, payload: { text } })} /></>}
      center={<><h2>Timeline</h2><TimelinePanel segments={contract.timeline.segments} onAdjustTiming={(sceneId, durationFrames) => emitCommand({ type: 'update_scene_timing', target_id: sceneId, payload: { duration_frames: durationFrames } })} /><h2>Narration</h2><NarrationPanel lines={contract.narration?.lines ?? []} onEdit={(sceneId, text) => emitCommand({ type: 'update_narration', target_id: sceneId, payload: { text } })} /></>}
      right={<><h2>Preview</h2><PreviewPanel preview={preview} /><AssetPanel assets={contract.asset_manifest?.assets ?? []} /></>}
    />
  );
}
