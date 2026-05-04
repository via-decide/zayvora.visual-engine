const { run } = require("../engine/orchestrator");
const { OutputContract } = require("../core/output-contract");

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
