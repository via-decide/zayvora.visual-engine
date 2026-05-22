import { ResearchOrchestrator } from './research_orchestrator.js';
import { PipelineState } from './pipeline_state.js';
import { PipelineTraceLogger } from './pipeline_trace_logger.js';

export class NotebookResearchPipeline {
  constructor({ orchestrator = new ResearchOrchestrator(), stateFactory = (input) => new PipelineState({ input }), traceLogger = new PipelineTraceLogger() } = {}) {
    this.orchestrator = orchestrator;
    this.stateFactory = stateFactory;
    this.traceLogger = traceLogger;
  }

  async run(input, options = {}) {
    const state = this.stateFactory(input);
    this.traceLogger.log('pipeline_start', { input });

    try {
      state.recordStage({ stage: 'input', status: 'completed', payload: { input } });
      this.traceLogger.log('source_discovery_start');

      const result = await this.orchestrator.run(input, options);

      const stages = [
        ['source_discovery', result.source_discovery],
        ['resource_ingestion', result.ingestion_manifest],
        ['evidence_extraction', result.evidence],
        ['source_quality_scoring', result.source_quality],
        ['research_brief', result.research_brief],
        ['video_research_package', result.video_research_package],
        ['verification_gate', result.verification_report],
        ['visual_engine_handoff', result.visual_engine_handoff],
      ];

      for (const [stage, payload] of stages) {
        state.recordStage({ stage, status: 'completed', payload });
        this.traceLogger.log(stage, { hash: state.stages[state.stages.length - 1].hash });
      }

      const summary = state.summary();
      this.traceLogger.log('pipeline_complete', summary);

      return {
        verified: Boolean(result.verification_report?.ready_for_video),
        ready_for_video: Boolean(result.verification_report?.ready_for_video),
        result,
        pipeline_state: state,
        pipeline_summary: summary,
        trace: this.traceLogger.export(),
      };
    } catch (error) {
      state.recordStage({ stage: 'pipeline', status: 'failed', error: error.message });
      this.traceLogger.log('pipeline_failed', { error: error.message });
      return {
        verified: false,
        ready_for_video: false,
        error: error.message,
        pipeline_state: state,
        pipeline_summary: state.summary(),
        trace: this.traceLogger.export(),
      };
    }
  }
}
