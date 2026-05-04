import { TraceEngine } from "./trace-engine.js";
import { enrichPrompt } from "../promptalchemy/index.js";
import { createSlides } from "./slide-json-engine.js";
import { renderCarousel } from "../renderer/render-html.js";

export async function runZayvora({ input, mode = "full", slideCount = 15 }) {
  const trace = new TraceEngine();

  trace.add("Access / Entry", mode === "create" ? "NFC workspace launch" : "Local workspace or CLI launch");
  trace.add("Intent Capture", input || "No input supplied");

  const context = await localResearch(input, trace);
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

async function localResearch(input, trace) {
  trace.add("Nex Local Research", "Offline context lookup started");
  const text = String(input || "").toLowerCase();

  if (text.includes("api")) return "API dependency creates hidden rent, reliability coupling, and margin leakage.";
  if (text.includes("ai")) return "Local AI systems create ownership over latency, data, privacy, and workflow.";
  if (text.includes("nfc")) return "NFC acts as a physical trigger into a local workspace and repeatable artifact flow.";

  return "No specific cached packet found. Continue with general local reasoning.";
}
