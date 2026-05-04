'use strict';

function aggregateResults(results) {
  if (!Array.isArray(results)) throw new Error('results must be an array');
  return results
    .filter((item) => item && item.success)
    .sort((a, b) => a.id.localeCompare(b.id));
}

module.exports = {
  aggregateResults
};
