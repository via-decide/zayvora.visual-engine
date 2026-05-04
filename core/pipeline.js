'use strict';

const { normalizePromptSpec } = require('./prompt-spec');
const { generateVariations } = require('./variation-engine');
const { planExecution } = require('./execution-planner');
const { runBatch } = require('./batch-runner');
const { aggregateResults } = require('./result-aggregator');
const { buildPDF } = require('./pdf-builder');
const { stableHash } = require('./variation-engine');

function generate(promptSpec) {
  const spec = normalizePromptSpec(promptSpec);
  const flowId = `flow_${stableHash(JSON.stringify(spec))}`;
  const trace = createTrace(flowId);

  traceSpan(trace, 'variation generation', () => {
    trace.variations = generateVariations(spec);
  });

  traceSpan(trace, 'planning', () => {
    trace.plan = planExecution(trace.variations);
  });

  traceSpan(trace, 'execution', () => {
    trace.rawResults = runBatch(trace.plan);
  });

  traceSpan(trace, 'aggregation', () => {
    trace.results = aggregateResults(trace.rawResults);
  });

  traceSpan(trace, 'pdf build', () => {
    trace.pdfPath = buildPDF(flowId, spec, trace.results);
  });

  return {
    flowId,
    results: trace.results,
    pdfPath: trace.pdfPath,
    trace
  };
}

function createTrace(flowId) {
  return { flowId, createdAt: 'deterministic', spans: [] };
}

function traceSpan(trace, name, fn) {
  const startOrder = trace.spans.length;
  fn();
  trace.spans.push({ name, order: startOrder, status: 'ok' });
}

module.exports = {
  generate,
  generateVariations,
  planExecution,
  runBatch,
  aggregateResults,
  buildPDF: (results, flowId = `flow_${stableHash(JSON.stringify(results))}`, promptSpec = { base_prompt: 'unspecified' }) =>
    buildPDF(flowId, promptSpec, results)
};
