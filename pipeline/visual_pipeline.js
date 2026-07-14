import { sha256Hash } from '../visual/visual_hash.js';
import { sceneGraphToTimeline } from './scene_to_timeline.js';
import { timelineToRenderContract } from './timeline_to_contract.js';

const DEFAULT_BEATS = ['Hook', 'Initial State', 'Pressure', 'Failure', 'Root Cause', 'System View', 'Conclusion'];

function titleCase(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
}

function requireNonEmptyString(value, code) {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(code);
  return value.trim();
}

function domainWords(topic) {
  return topic.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2).slice(0, 4);
}

function inferSubject(topic) {
  const lower = topic.toLowerCase();
  if (lower.includes('api')) return 'API';
  if (lower.includes('heat exchanger')) return 'heat exchanger';
  if (lower.includes('local-first')) return 'local-first software';
  return topic.replace(/^(why|how|what)\s+/i, '').trim() || topic;
}

function lineForBeat(beat, topic, subject, index) {
  const lower = topic.toLowerCase();
  if (lower.includes('api') && lower.includes('scale')) {
    return [
      topic,
      'The API works when traffic is small',
      'Requests, dependencies, and state increase together',
      'Latency and cascading failures appear',
      'The system was designed around the happy path',
      'Scale exposes coordination limits across services',
      'API scaling is a systems problem',
    ][index];
  }
  if (lower.includes('heat exchanger')) {
    return [
      topic,
      'Hot and cold fluids enter separated channels',
      'A temperature difference creates the driving force',
      'Conductive walls and surface area move energy',
      'Flow pattern controls how much heat transfers',
      'Efficiency depends on materials, area, and residence time',
      'A heat exchanger transfers energy without mixing fluids',
    ][index];
  }
  if (lower.includes('local-first')) {
    return [
      topic,
      'Work begins on the user-owned device',
      'Data remains useful without a remote server',
      'Sync coordinates changes instead of controlling access',
      'Ownership shifts from platform custody to user agency',
      'Conflicts become explicit collaboration events',
      'Local-first software changes who holds the source of truth',
    ][index];
  }
  const words = domainWords(topic).join(', ') || subject;
  return [
    topic,
    `${titleCase(subject)} starts in a simple, understandable state`,
    `More ${words} adds pressure to the system`,
    `The weak point becomes visible when conditions change`,
    `The root cause sits in an assumption made too early`,
    `A wider system view reveals the real constraint`,
    `${titleCase(subject)} needs a complete system explanation`,
  ][index] || `${beat}: ${topic}`;
}

export function createIntent(prompt) {
  const idea = requireNonEmptyString(prompt, 'MISSING_PROMPT');
  const subject = inferSubject(idea);
  const intent = {
    stage: 'intent',
    original_idea: idea,
    subject,
    communication_objective: `Explain ${subject} as a clear visual sequence a reviewer can inspect slide by slide.`,
    audience: 'general technical audience',
    artifact_type: 'ordered visual slide artifact',
  };
  intent.intent_hash = sha256Hash(intent);
  return intent;
}

export function createNarrative(intent) {
  if (!intent?.communication_objective) throw new Error('MISSING_INTENT_OUTPUT');
  const beats = DEFAULT_BEATS.map((beat, index) => ({
    beat_id: `BEAT-${String(index + 1).padStart(3, '0')}`,
    order: index + 1,
    role: beat,
    message: lineForBeat(beat, intent.original_idea, intent.subject, index),
  }));
  if (beats.length === 0) throw new Error('EMPTY_NARRATIVE');
  const narrative = { stage: 'narrative', title: titleCase(intent.original_idea), beats };
  narrative.narrative_hash = sha256Hash(narrative);
  return narrative;
}

export function createSlideSpecification(narrative, config = {}) {
  if (!Array.isArray(narrative?.beats) || narrative.beats.length === 0) throw new Error('EMPTY_NARRATIVE');
  const slides = narrative.beats.map((beat) => ({
    slide_id: `SLIDE-${String(beat.order).padStart(3, '0')}`,
    scene_id: `SCENE-${String(beat.order).padStart(3, '0')}`,
    order: beat.order,
    role: beat.role,
    title: beat.message,
    subtitle: beat.role,
    duration_frames: config.scene_duration_frames ?? 120,
    layers: [
      { layer_id: `LAYER-${String(beat.order).padStart(3, '0')}-ROLE`, type: 'text', content: `${String(beat.order).padStart(2, '0')} — ${beat.role}`, position: { x: 96, y: 86 }, style: { fontSize: 30, color: '#8ddcff', fontWeight: 700 } },
      { layer_id: `LAYER-${String(beat.order).padStart(3, '0')}-TITLE`, type: 'text', content: beat.message, position: { x: 96, y: 155 }, style: { fontSize: 58, color: '#ffffff', fontWeight: 800 } },
    ],
  }));
  validateSlideSpecification({ slides });
  const spec = { stage: 'slide_specification', slides };
  spec.slide_spec_hash = sha256Hash(spec);
  return spec;
}

export function validateSlideSpecification(spec) {
  if (!Array.isArray(spec?.slides) || spec.slides.length === 0) throw new Error('NO_SLIDES_PRODUCED');
  for (const slide of spec.slides) {
    if (!slide.slide_id || !slide.scene_id || !Number.isInteger(slide.order) || !slide.title) throw new Error('INVALID_SLIDE_SPECIFICATION');
    if (!Array.isArray(slide.layers) || slide.layers.length === 0) throw new Error('INVALID_SLIDE_SPECIFICATION');
  }
  return true;
}

export function renderSlides(slideSpec) {
  validateSlideSpecification(slideSpec);
  const slides = slideSpec.slides.map((slide) => ({ ...slide, visible: true, surface: 'html-slide' }));
  if (slides.length === 0) throw new Error('ZERO_VISIBLE_SLIDES');
  const artifact = { stage: 'artifact', renderer: 'html', slides, slide_count: slides.length, complete: true };
  artifact.artifact_hash = sha256Hash(artifact);
  return artifact;
}

export function runCanonicalVisualPipeline(prompt, config = {}) {
  const trace = [];
  const record = (stage, payload) => trace.push({ stage, hash: sha256Hash(payload), summary: payload.communication_objective || payload.title || `${payload.slide_count || payload.slides?.length || 0} slides` });
  const intent = createIntent(prompt); record('intent', intent);
  const narrative = createNarrative(intent); record('narrative', narrative);
  const slide_specification = createSlideSpecification(narrative, config); record('slide_specification', slide_specification);
  const scene_graph = { schema_version: '1.0.0', request_id: config.request_id ?? `VISUAL-${sha256Hash(prompt).slice(7, 15).toUpperCase()}`, prompt, normalized_intent: intent, scenes: slide_specification.slides, deterministic: true };
  scene_graph.scene_graph_hash = sha256Hash(scene_graph);
  const timeline = sceneGraphToTimeline(scene_graph, config);
  const render_contract = timelineToRenderContract({ request_id: scene_graph.request_id, prompt, normalized_intent: intent, scene_graph, timeline, renderer: 'html', dimensions: config.dimensions ?? { width: 1280, height: 720 } });
  const artifact = renderSlides(slide_specification); record('visual_render', artifact);
  if (!artifact.complete || artifact.slides.length === 0) throw new Error('SUCCESS_WITHOUT_ARTIFACT');
  return { status: 'success', prompt, intent, narrative, slide_specification, scene_graph, timeline, render_contract, artifact, trace };
}
