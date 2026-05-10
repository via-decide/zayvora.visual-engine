const templates = ["statement", "split", "list", "narrative", "fullscreen"];

export function createSlides({ topic, slideCount = 15 }) {
  const seed = hash(topic);
  const subject = titleCase(topic);
  const slides = [];

  slides.push({
    template: "statement",
    eyebrow: "ZAYVORA",
    headline: `${subject} is not the problem.`,
    subline: "The system around it is.",
    highlight: "system",
    highlightColor: "cyan"
  });

  const frames = [
    ["Most people see the surface.", "Operators see the dependency graph."],
    ["A vague prompt is not weak.", "A weak system makes it weak."],
    ["The input should not carry the taste.", "The engine should."],
    ["Templates are not limitations.", "They are visual contracts."],
    ["Research creates grounding.", "Alchemy creates voice."],
    ["JSON creates control.", "HTML creates repeatability."],
    ["The user asks once.", "The workspace remembers the pattern."],
    ["Local execution changes the game.", "No API. No waiting. No permission."],
    ["The output is not an image.", "It is rendered thinking."],
    ["A carousel is only the first artifact.", "The system can write anything."],
    ["The real moat is not prompts.", "It is owned workflow."],
    ["Make the machine boring.", "Make the result impossible to ignore."],
    ["When the card taps,", "the workspace becomes the studio."],
    ["This is not generation.", "This is local authorship."]
  ];

  for (let i = 1; i < slideCount; i += 1) {
    const pair = frames[(i + seed) % frames.length];
    const template = templates[(i + seed) % templates.length];
    slides.push(buildSlide(template, i + 1, pair, topic));
  }

  return slides.slice(0, slideCount);
}

function buildSlide(template, index, pair, topic) {
  if (template === "list") {
    return {
      template,
      eyebrow: `STEP ${String(index).padStart(2, "0")}`,
      headline: pair[0],
      items: ["intent", "structure", "taste", "render"],
      subline: pair[1],
      highlight: "render",
      highlightColor: "purple"
    };
  }
  if (template === "split") {
    return {
      template,
      eyebrow: `FRAME ${String(index).padStart(2, "0")}`,
      left: pair[0],
      right: pair[1],
      highlight: "right",
      highlightColor: "cyan"
    };
  }
  return {
    template,
    eyebrow: `SLIDE ${String(index).padStart(2, "0")}`,
    headline: pair[0],
    subline: pair[1],
    highlight: keyword(pair[1] || topic),
    highlightColor: index % 3 === 0 ? "red" : "cyan"
  };
}

export function hash(value) {
  const input = String(value);
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) h = ((h << 5) + h) ^ input.charCodeAt(i);
  return h >>> 0;
}

export function titleCase(value) {
  return String(value).replace(/\w\S*/g, word => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

export function keyword(value) {
  const words = String(value).replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter(Boolean);
  return words[words.length - 1] || "system";
}
