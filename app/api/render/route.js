import { VisualGenerationEngine } from '../../../engine/visual_generation_engine.js';

export async function POST(req) {
  const body = await req.json();
  const engine = new VisualGenerationEngine({
    renderer: body.target ?? 'preview',
    dimensions: { width: body.width ?? 1920, height: body.height ?? 1080 },
    fps: body.fps ?? 30,
    format: body.format ?? 'mp4',
  });
  const result = engine.generateFromPrompt(body.prompt ?? '', { target: body.target ?? 'preview' });
  return Response.json({
    request_id: result.request_id,
    render_contract_hash: result.render_contract.render_hash,
    output_manifest: result.output_manifest,
    deterministic: true,
  });
}
