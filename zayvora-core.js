import { TraceEngine } from "./trace-engine.js";
import { enrichPrompt } from "./index.js";
import { createSlides } from "./slide-json-engine.js";
import { renderCarousel } from "./render-html.js";

export async function runZayvora({ input, mode = "full", slideCount = 15 }) {
  const trace = new TraceEngine();

  trace.add("Access / Entry", mode === "create" ? "NFC workspace launch" : "Local workspace or CLI launch");
  trace.add("Intent Capture", input || "No input supplied");

  const context = await matchContext(input, trace);
  const enriched = enrichPrompt({ input, context, slideCount });
  trace.add("PromptAlchemy", "Vague input converted into structured creative intent");

  const slides = createSlides({ topic: enriched.topic, slideCount });
  trace.add("Slide JSON Engine", `Created ${slides.length} slide specs`);

  const html = renderCarousel(slides);
  trace.add("Renderer", "Compiled slide JSON into deterministic HTML carousel");

  trace.add("Output / Metrics", `${slides.length} slides ready`);

  return {
    ok: true,
    input,
    mode,
    enriched,
    slides,
    html,
    trace: trace.summary()
  };
}

const CONTEXT_PACKETS = [
  { keys: ["ai", "infrastructure", "ml", "gpu"], context: "Local AI infrastructure controls latency, data boundaries, and operating margin across inference workflows." },
  { keys: ["browser", "architecture", "render", "engine"], context: "Browser architecture balances parsing, execution, compositing, and isolation for predictable client performance." },
  { keys: ["otp", "execution", "workflow", "orchestration"], context: "OTP execution systems coordinate deterministic task state, retries, and auditability across operational pipelines." },
  { keys: ["api", "dependency", "external"], context: "API dependency introduces reliability coupling, cost leakage, and vendor-constrained iteration speed." },
  { keys: ["nfc", "tap", "trigger"], context: "NFC interactions provide physical entry points into repeatable local workspace automation flows." }
];

async function matchContext(input, trace) {
  trace.add("Next Local Research", "Offline context packet matching started");
  const text = String(input || "").toLowerCase();
  const packet = CONTEXT_PACKETS.find(({ keys }) => keys.some(key => text.includes(key)));

  if (packet) {
    trace.add("Context Match", `Matched packet: ${packet.keys[0]}`);
    return packet.context;
  }

  trace.add("Context Match", "Fallback packet used");
  return "No specific packet matched. Continue with deterministic general systems framing.";
}
