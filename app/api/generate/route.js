import { runCanonicalVisualPipeline } from '../../../pipeline/visual_pipeline.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const result = runCanonicalVisualPipeline(body.input ?? body.prompt ?? '', { scene_duration_frames: 120 });
    return Response.json(result);
  } catch (error) {
    return Response.json({ status: 'failed', error: error.message, artifact: null }, { status: 422 });
  }
}
