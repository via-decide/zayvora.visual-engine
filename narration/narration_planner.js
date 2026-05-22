import { addPausePoints, estimateDurationSec } from './pacing_engine.js';
import { inferToneFromScene, normalizeTone } from './voice_direction.js';

export function storyboardToNarrationPlan(storyboard = {}) {
  const scenes = storyboard.scenes ?? [];
  return scenes.map((scene, index) => {
    const text = scene.narration_text ?? scene.summary ?? scene.title ?? `Scene ${index + 1}`;
    const tone = normalizeTone(scene.tone ?? inferToneFromScene(scene));
    return {
      scene_id: scene.scene_id ?? `SCENE-${String(index + 1).padStart(3, '0')}`,
      text,
      duration_sec: estimateDurationSec(text),
      tone,
      pause_points: addPausePoints(text),
    };
  });
}
