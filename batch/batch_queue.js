export class BatchQueue {
  constructor(jobs = []) {
    this.jobs = jobs;
    this.pointer = 0;
  }

  hasNext() {
    return this.pointer < this.jobs.length;
  }

  next() {
    if (!this.hasNext()) return null;
    const job = this.jobs[this.pointer];
    this.pointer += 1;
    return job;
  }

  update(jobId, patch) {
    this.jobs = this.jobs.map((job) => (job.job_id === jobId ? { ...job, ...patch } : job));
  }

  snapshot() {
    return {
      total: this.jobs.length,
      queued: this.jobs.filter((j) => j.status === 'queued').length,
      running: this.jobs.filter((j) => j.status === 'running').length,
      succeeded: this.jobs.filter((j) => j.status === 'succeeded').length,
      failed: this.jobs.filter((j) => j.status === 'failed').length,
      jobs: this.jobs,
    };
  }
}
