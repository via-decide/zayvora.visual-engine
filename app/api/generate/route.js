import { runCanonicalVisualPipeline, runNexResearchHandoffPipeline } from '../../../pipeline/visual_pipeline.js';
import { createNexVisualHandoff } from '../../../integrations/nex_visual_handoff_contract.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const result = body.nex_handoff
      ? runNexResearchHandoffPipeline(createNexVisualHandoff(body.nex_handoff), { scene_duration_frames: 120 })
      : runCanonicalVisualPipeline(body.input ?? body.prompt ?? '', { scene_duration_frames: 120 });
    return Response.json(result);
  } catch (error) {
    return Response.json({ status: 'failed', error: error.message, artifact: null }, { status: 422 });
  }
}
