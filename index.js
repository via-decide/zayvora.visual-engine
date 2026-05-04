const DEFAULT_VOICE = {
  tone: "brutal, contrarian, founder-native, short lines",
  audience: "builders, solo founders, CTOs, operators",
  format: "15-slide dark carousel",
  rules: [
    "start with tension",
    "avoid generic advice",
    "use one idea per slide",
    "make every line visually renderable",
    "end with ownership thesis"
  ]
};

export function enrichPrompt({ input, context = "", slideCount = 15 }) {
  const topic = normalizeTopic(input);
  return {
    original: input,
    topic,
    slideCount,
    voice: DEFAULT_VOICE,
    context,
    enrichedPrompt:
`Create a ${slideCount}-slide deterministic carousel.
Topic: ${topic}
Audience: ${DEFAULT_VOICE.audience}
Tone: ${DEFAULT_VOICE.tone}
Context: ${context || "No external context. Use general local reasoning only."}
Structure:
1. Hook with a sharp contradiction.
2. Name the hidden system.
3. Show the cost.
4. Make the abstract concrete.
5. Show the trap.
6. Show the operator insight.
7. Contrast weak vs strong builders.
8. Reveal ownership thesis.
9. End with a memorable closing line.
Output strict slide JSON only.`
  };
}

function normalizeTopic(input) {
  const clean = String(input || "").trim().replace(/\s+/g, " ");
  return clean || "local creative systems";
}
