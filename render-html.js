export function renderCarousel(slides) {
  const body = slides.map((slide, index) => renderSlide(slide, index)).join("\n");
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Zayvora Carousel</title>
<link rel="stylesheet" href="/tokens.css">
</head>
<body>
<main class="carousel">${body}</main>
</body>
</html>`;
}

function renderSlide(slide, index) {
  const cls = `slide ${slide.template || "statement"}`;
  if (slide.template === "split") {
    return `<section class="${cls}">
      <div class="eyebrow">${escapeHtml(slide.eyebrow || "")}</div>
      <div class="split-grid">
        <h1>${escapeHtml(slide.left || "")}</h1>
        <h2>${escapeHtml(slide.right || "")}</h2>
      </div>
      <div class="count">${index + 1}</div>
    </section>`;
  }
  if (slide.template === "list") {
    const items = (slide.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    return `<section class="${cls}">
      <div class="eyebrow">${escapeHtml(slide.eyebrow || "")}</div>
      <h1>${escapeHtml(slide.headline || "")}</h1>
      <ul>${items}</ul>
      <p>${escapeHtml(slide.subline || "")}</p>
      <div class="count">${index + 1}</div>
    </section>`;
  }
  return `<section class="${cls}">
    <div class="eyebrow">${escapeHtml(slide.eyebrow || "")}</div>
    <h1>${escapeHtml(slide.headline || "")}</h1>
    <p>${escapeHtml(slide.subline || "")}</p>
    <div class="count">${index + 1}</div>
  </section>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}
