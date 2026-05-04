const input = document.getElementById("input");
const mode = document.getElementById("mode");
const button = document.getElementById("generate");
const traceList = document.getElementById("traceList");
const previewFrame = document.getElementById("previewFrame");

const params = new URLSearchParams(location.search);
if (params.get("mode")) mode.value = params.get("mode");
if (params.get("q")) input.value = params.get("q");

button.addEventListener("click", generate);

async function generate() {
  button.disabled = true;
  button.textContent = "Generating...";
  traceList.innerHTML = "";

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: input.value,
      mode: mode.value,
      slideCount: 15
    })
  });

  const result = await response.json();
  renderTrace(result.trace?.steps || []);
  previewFrame.srcdoc = result.html || "";
  button.disabled = false;
  button.textContent = "Generate";
}

function renderTrace(steps) {
  traceList.innerHTML = steps.map(step => `
    <div class="step">
      <strong>${step.title}</strong><br>
      <span>${step.detail}</span>
    </div>
  `).join("");
}
