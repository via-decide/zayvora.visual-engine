export class PipelineTraceLogger {
  constructor() {
    this.events = [];
  }

  log(stage, data = {}) {
    this.events.push({
      stage,
      at: new Date().toISOString(),
      data,
    });
  }

  export() {
    return {
      event_count: this.events.length,
      events: this.events,
    };
  }
}
