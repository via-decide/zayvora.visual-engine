import { run } from "./engine/orchestrator.js";
import { OutputContract } from "./core/output-contract.js";

(async () => {
  const contract = new OutputContract({
    files: ["test.task.md"],
    allowedExtensions: [".md"]
  });

  try {
    const result = await run({
      repo: "via-decide/promptalchemy",
      contract
    });

    console.log("PASS", result);
  } catch (e) {
    console.error("FAIL", e.message);
  }
})();
