import fs from "node:fs";
import path from "node:path";
import { runZayvora } from "./engine/zayvora-core.js";

const input = process.argv.slice(2).join(" ").trim() || "why APIs fail at scale";
const result = await runZayvora({ input, mode: "full", slideCount: 15 });

const outDir = path.join(process.cwd(), "output");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "slides.json"), JSON.stringify(result.slides, null, 2));
fs.writeFileSync(path.join(outDir, "trace.json"), JSON.stringify(result.trace, null, 2));
fs.writeFileSync(path.join(outDir, "carousel.html"), result.html);

console.log(`Created output/slides.json`);
console.log(`Created output/trace.json`);
console.log(`Created output/carousel.html`);
