'use strict';

const fs = require('fs');
const path = require('path');

function buildPDF(flowId, promptSpec, results, outputDir = path.join(process.cwd(), 'outputs')) {
  fs.mkdirSync(outputDir, { recursive: true });
  const pdfPath = path.join(outputDir, `${flowId}.pdf`);

  const lines = [
    '%PDF-1.1',
    '% Deterministic Visual Execution Report',
    `Flow: ${flowId}`,
    `Prompt: ${promptSpec.base_prompt}`,
    `Total Results: ${results.length}`,
    '--- GRID ---'
  ];

  results.forEach((row, index) => {
    lines.push(`${index + 1}. ${row.id} | ${row.image} | ${JSON.stringify(row.config)}`);
  });

  lines.push('%%EOF');
  fs.writeFileSync(pdfPath, `${lines.join('\n')}\n`, 'utf8');
  return pdfPath;
}

module.exports = {
  buildPDF
};
