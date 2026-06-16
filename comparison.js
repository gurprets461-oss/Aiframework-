/**
 * Case study comparison matrix — cross-device rubric breakdown.
 * Loaded by index.html after rubric.js; renders into #comparison-matrix-mount.
 */
(function () {
  'use strict';

  var DEVICE_ORDER = ['idx-dr', 'contact', 'gi-genius', 'rapid-ich', 'aeye-ds'];

  var SCORE_META = {
    0: { label: '0', title: 'Absent', className: 'cmp-score-0' },
    0.5: { label: '0.5', title: 'Partially present', className: 'cmp-score-05' },
    1: { label: '1', title: 'Clearly present', className: 'cmp-score-1' },
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getRubricData() {
    if (!window.RubricScorer) return null;
    return {
      criteria: window.RubricScorer.CRITERIA,
      examples: window.RubricScorer.EXAMPLES,
      getBand: window.RubricScorer.getBand,
    };
  }

  function getDeviceScore(example, criterionId) {
    if (!example || !example.scores) return null;
    var value = example.scores[criterionId];
    return value === 0 || value === 0.5 || value === 1 ? value : null;
  }

  function getCriterionStats(criterionId, devices, examples) {
    var scores = devices.map(function (id) {
      return getDeviceScore(examples[id], criterionId);
    });
    var sum = 0;
    var count = 0;
    var allZero = true;
    var allWeak = true;

    scores.forEach(function (score) {
      if (score === null) return;
      sum += score;
      count += 1;
      if (score !== 0) allZero = false;
      if (score > 0.5) allWeak = false;
    });

    return {
      scores: scores,
      average: count ? sum / count : null,
      allZero: count === devices.length && allZero,
      allWeak: count === devices.length && allWeak,
    };
  }

  function formatScore(value) {
    if (value === null || value === undefined) return '—';
    return value % 1 === 0 ? String(value) : value.toFixed(1);
  }

  function bandClassName(band) {
    if (!band) return '';
    return 'cmp-total-' + band.key;
  }

  function renderGapInsights(criteria, devices, examples) {
    var universal = [];
    var widespread = [];

    criteria.forEach(function (c) {
      var stats = getCriterionStats(c.id, devices, examples);
      if (stats.allZero) universal.push(c);
      else if (stats.allWeak) widespread.push(c);
    });

    if (!universal.length && !widespread.length) return '';

    var parts = [];

    if (universal.length) {
      var universalItems = universal
        .map(function (c) {
          return '<li><strong>' + escapeHtml(c.num) + '. ' + escapeHtml(c.title) + '</strong></li>';
        })
        .join('');
      parts.push(
        '<div class="cmp-insight cmp-insight-critical">' +
        '<p class="cmp-insight-title">Universal transparency gap</p>' +
        '<p class="cmp-insight-body">All five pilot devices scored <strong>0</strong> on:</p>' +
        '<ul class="cmp-insight-list">' +
        universalItems +
        '</ul>' +
        '</div>'
      );
    }

    if (widespread.length) {
      var widespreadItems = widespread
        .map(function (c) {
          return '<li><strong>' + escapeHtml(c.num) + '. ' + escapeHtml(c.title) + '</strong></li>';
        })
        .join('');
      parts.push(
        '<div class="cmp-insight">' +
        '<p class="cmp-insight-title">Frequently weak across devices</p>' +
        '<p class="cmp-insight-body">No device scored above <strong>0.5</strong> on:</p>' +
        '<ul class="cmp-insight-list">' +
        widespreadItems +
        '</ul>' +
        '</div>'
      );
    }

    return '<div class="cmp-insights">' + parts.join('') + '</div>';
  }

  function renderMatrix(container) {
    var data = getRubricData();
    if (!container || !data) return false;

    var criteria = data.criteria;
    var examples = data.examples;
    var devices = DEVICE_ORDER.filter(function (id) {
      return id && examples[id] && id !== '';
    });

    var headerCells = devices
      .map(function (id) {
        var example = examples[id];
        var name = example.deviceName || example.label;
        return (
          '<th scope="col" class="cmp-device-col">' +
          '<button type="button" class="cmp-device-btn" data-example="' +
          escapeHtml(id) +
          '" title="Open rubric breakdown for ' +
          escapeHtml(name) +
          '">' +
          escapeHtml(name) +
          '</button>' +
          '</th>'
        );
      })
      .join('');

    var bodyRows = criteria
      .map(function (c) {
        var stats = getCriterionStats(c.id, devices, examples);
        var rowClass = stats.allZero ? ' cmp-row-gap' : stats.allWeak ? ' cmp-row-weak' : '';

        var cells = stats.scores
          .map(function (score, index) {
            var meta = SCORE_META[score];
            if (!meta) {
              return '<td class="cmp-score-cell cmp-score-empty">—</td>';
            }
            var deviceId = devices[index];
            var deviceName = examples[deviceId].deviceName || examples[deviceId].label;
            return (
              '<td class="cmp-score-cell ' +
              meta.className +
              '">' +
              '<span class="cmp-score-value" title="' +
              escapeHtml(c.title) +
              ' · ' +
              escapeHtml(deviceName) +
              ': ' +
              escapeHtml(meta.title) +
              '">' +
              escapeHtml(meta.label) +
              '</span>' +
              '</td>'
            );
          })
          .join('');

        return (
          '<tr class="cmp-row' +
          rowClass +
          '">' +
          '<th scope="row" class="cmp-criterion-col">' +
          '<span class="cmp-criterion-num">' +
          escapeHtml(c.num) +
          '</span>' +
          '<span class="cmp-criterion-title">' +
          escapeHtml(c.title) +
          '</span>' +
          '</th>' +
          cells +
          '</tr>'
        );
      })
      .join('');

    var totalCells = devices
      .map(function (id) {
        var example = examples[id];
        var scores = {};
        if (example.scores) {
          Object.keys(example.scores).forEach(function (key) {
            scores[key] = example.scores[key];
          });
        }
        var total = 0;
        var scored = 0;
        criteria.forEach(function (c) {
          var score = getDeviceScore(example, c.id);
          if (score !== null) {
            total += score;
            scored += 1;
          }
        });
        var complete = scored === criteria.length;
        var band = complete ? data.getBand(total) : null;
        return (
          '<td class="cmp-total-cell ' +
          bandClassName(band) +
          '">' +
          '<span class="cmp-total-value">' +
          escapeHtml(formatScore(total)) +
          '</span>' +
          (band
            ? '<span class="cmp-total-band">' + escapeHtml(band.label) + '</span>'
            : '') +
          '</td>'
        );
      })
      .join('');

    container.innerHTML =
      '<div class="cmp-matrix-wrap">' +
      '<div class="cmp-legend" aria-hidden="true">' +
      '<span class="cmp-legend-item cmp-score-0"><strong>0</strong> Absent</span>' +
      '<span class="cmp-legend-item cmp-score-05"><strong>0.5</strong> Partial</span>' +
      '<span class="cmp-legend-item cmp-score-1"><strong>1</strong> Present</span>' +
      '<span class="cmp-legend-note">Rows highlighted when all devices score 0.</span>' +
      '</div>' +
      '<div class="cmp-table-scroll">' +
      '<table class="cmp-table" aria-label="Rubric criterion scores across pilot case study devices">' +
      '<thead>' +
      '<tr>' +
      '<th scope="col" class="cmp-criterion-col">Criterion</th>' +
      headerCells +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      bodyRows +
      '<tr class="cmp-total-row">' +
      '<th scope="row" class="cmp-criterion-col">Total / 12</th>' +
      totalCells +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>' +
      renderGapInsights(criteria, devices, examples) +
      '<p class="cmp-disclaimer">Scores reflect illustrative pilot reviews of publicly accessible FDA-facing materials. Click a device name to open its full rubric breakdown.</p>' +
      '</div>';

    container.querySelectorAll('.cmp-device-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var exampleId = btn.dataset.example;
        if (exampleId && typeof window.goToRubricExample === 'function') {
          window.goToRubricExample(exampleId);
        }
      });
    });

    return true;
  }

  function initComparison(retryCount) {
    retryCount = retryCount || 0;
    var container = document.getElementById('comparison-matrix-mount');
    if (!container) return;

    if (!renderMatrix(container)) {
      if (retryCount < 40) {
        setTimeout(function () {
          initComparison(retryCount + 1);
        }, 50);
      } else {
        container.innerHTML =
          '<p class="body-text">Comparison matrix could not load. Ensure <code>rubric.js</code> is available.</p>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initComparison();
    });
  } else {
    initComparison();
  }

  window.CaseStudyComparison = {
    DEVICE_ORDER: DEVICE_ORDER,
    refresh: initComparison,
  };
})();