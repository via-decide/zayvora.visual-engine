export class TraceEngine {
  constructor() {
    this.startedAt = new Date().toISOString();
    this.steps = [];
  }

  add(title, detail = "", status = "done") {
    const step = {
      id: String(this.steps.length + 1).padStart(2, "0"),
      title,
      detail,
      status,
      at: new Date().toISOString()
    };
    this.steps.push(step);
    return step;
  }

  summary() {
    return {
      startedAt: this.startedAt,
      finishedAt: new Date().toISOString(),
      count: this.steps.length,
      steps: this.steps
    };
  }
}
