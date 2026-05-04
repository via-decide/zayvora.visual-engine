#!/usr/bin/env node

const { run } = require("../engine/orchestrator");
const { OutputContract } = require("../core/output-contract");

(async () => {
  const contract = new OutputContract({
    files: ["realtime-prompt-test.task.md"],
    allowedExtensions: [".md"]
  });

  const result = await run({
    repo: "via-decide/promptalchemy",
    contract
  });

  console.log("[PIPELINE]", result.status);
  console.log("[FILES]", result.files);
})();
