(function () {
  'use strict';

  function debugLog(message, meta) {
    const el = document.getElementById('debugLog');
    const line = document.createElement('div');
    line.className = 'debug-line';
    line.textContent = `[${new Date().toISOString()}] ${message}${meta ? ` :: ${meta}` : ''}`;
    if (el) el.prepend(line);
    console.log('[Zayvora]', message, meta || '');
  }

  function showError(message, detail) {
    const fallback = document.getElementById('fallback');
    const box = document.getElementById('errorBox');
    if (fallback) fallback.hidden = false;
    if (box) box.textContent = `${message}${detail ? `\n${detail}` : ''}`;
    debugLog('error', `${message} ${detail || ''}`);
  }

  window.onerror = function (message, source, lineno, colno, error) {
    showError('Runtime error occurred.', `${message} (${source || 'unknown'}:${lineno || 0}:${colno || 0})`);
    if (error && error.stack) debugLog('stack', error.stack);
    return false;
  };

  async function safeFetch(url, options) {
    debugLog('api call start', url);
    try {
      const response = await fetch(url, options);
      const text = await response.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (err) {
        throw new Error(`Invalid JSON response: ${err.message}`);
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${(json && (json.error || json.message)) || response.statusText}`);
      }
      debugLog('api call success', url);
      return { ok: true, data: json };
    } catch (error) {
      debugLog('api call failed', `${url} :: ${error.message}`);
      return { ok: false, error: error.message };
    }
  }

  function renderTrace(traceList, steps) {
    if (!traceList) return;
    traceList.innerHTML = (steps || []).map(function (step) {
      const title = step && step.title ? step.title : 'Step';
      const detail = step && step.detail ? step.detail : 'No detail';
      return `<div class="step"><strong>${title}</strong><br><span>${detail}</span></div>`;
    }).join('');
  }

  function renderLocalFallback(inputText, modeValue) {
    const safeInput = String(inputText || '').trim() || 'No input provided';
    return {
      trace: {
        steps: [
          { title: 'App Start', detail: 'Static mode initialized.' },
          { title: 'Intent Capture', detail: safeInput },
          { title: 'Mode', detail: modeValue },
          { title: 'Render', detail: 'Generated local deterministic preview.' }
        ]
      },
      html: `<html><body style="margin:0;background:#08080c;color:#fff;font-family:system-ui;padding:24px"><h2>Local Preview</h2><p>${safeInput}</p><p>Mode: ${modeValue}</p></body></html>`
    };
  }

  async function initApp() {
    debugLog('app start');
    const input = document.getElementById('input');
    const mode = document.getElementById('mode');
    const button = document.getElementById('generate');
    const traceList = document.getElementById('traceList');
    const previewFrame = document.getElementById('previewFrame');

    if (!input || !mode || !button || !traceList || !previewFrame) {
      showError('BOOTSTRAP_MISSING', 'Required DOM element was not found.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode')) mode.value = params.get('mode');
    if (params.get('q')) input.value = params.get('q');

    let inFlight = false;
    button.addEventListener('click', async function () {
      if (inFlight) return;
      inFlight = true;
      button.disabled = true;
      button.textContent = 'Generating...';
      traceList.innerHTML = '<div class="step">Loading...</div>';

      try {
        const payload = { input: input.value, mode: mode.value, slideCount: 15 };
        let result = null;
        if (window.location.protocol !== 'file:') {
          const apiResult = await safeFetch('./api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (apiResult.ok) result = apiResult.data;
          else showError('API request failed; using local fallback.', apiResult.error);
        }
        if (!result) result = renderLocalFallback(payload.input, payload.mode);
        renderTrace(traceList, result.trace && result.trace.steps ? result.trace.steps : []);
        previewFrame.srcdoc = result.html || '<p>No output.</p>';
      } catch (error) {
        showError('Generation failed.', error.message);
        renderTrace(traceList, [{ title: 'Error', detail: error.message }]);
      } finally {
        inFlight = false;
        button.disabled = false;
        button.textContent = 'Generate';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initApp().catch(function (error) {
      showError('Fatal init failure.', error.message);
    });
  });
})();
