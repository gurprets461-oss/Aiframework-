/**
 * Interactive Demographic Transparency and Deployment Readiness Rubric scorer.
 * Loaded by index.html; renders into #rubric-scorer.
 */
(function () {
  'use strict';

  var SCORE_OPTIONS = [
    { value: 1, label: '1', title: 'Clearly present' },
    { value: 0.5, label: '0.5', title: 'Partially present' },
    { value: 0, label: '0', title: 'Absent' },
  ];

  var CRITERIA = [
    { id: 'intended_use', num: '01', title: 'Intended use clearly specified' },
    { id: 'training_population', num: '02', title: 'Training population described' },
    { id: 'validation_population', num: '03', title: 'Validation population described' },
    { id: 'race_ethnicity', num: '04', title: 'Race/ethnicity reported' },
    { id: 'age', num: '05', title: 'Age reported' },
    { id: 'sex_gender', num: '06', title: 'Sex/gender reported' },
    { id: 'multisite_validation', num: '07', title: 'Multisite or geographically diverse validation reported' },
    { id: 'subgroup_performance', num: '08', title: 'Subgroup performance metrics reported' },
    { id: 'prospective_evaluation', num: '09', title: 'Prospective or real-world evaluation reported' },
    { id: 'post_market_monitoring', num: '10', title: 'Post-market monitoring plan described' },
    { id: 'limitations_boundaries', num: '11', title: 'Limitations and workflow boundaries clearly stated' },
    { id: 'local_fit', num: '12', title: 'Information useful for local fit assessment included' },
  ];

  var BANDS = [
    { min: 10, max: 12, key: 'strong', label: 'Strong transparency', className: 'rubric-band-strong' },
    { min: 7, max: 9.5, key: 'moderate', label: 'Moderate transparency', className: 'rubric-band-moderate' },
    { min: 4, max: 6.5, key: 'limited', label: 'Limited transparency', className: 'rubric-band-limited' },
    { min: 0, max: 3.5, key: 'poor', label: 'Poor transparency', className: 'rubric-band-poor' },
  ];

  var EXAMPLES = {
    '': { label: 'Blank rubric', deviceName: '', scores: {} },
    'idx-dr': {
      label: 'IDx-DR (pilot example)',
      deviceName: 'IDx-DR',
      scores: {
        intended_use: 1,
        training_population: 1,
        validation_population: 1,
        race_ethnicity: 1,
        age: 1,
        sex_gender: 0.5,
        multisite_validation: 0.5,
        subgroup_performance: 0.5,
        prospective_evaluation: 0.5,
        post_market_monitoring: 0,
        limitations_boundaries: 1,
        local_fit: 0.5,
      },
    },
    'contact': {
      label: 'ContaCT / Viz.ai (pilot example)',
      deviceName: 'ContaCT / Viz.ai',
      scores: {
        intended_use: 1,
        training_population: 0,
        validation_population: 0.5,
        race_ethnicity: 0,
        age: 0,
        sex_gender: 0,
        multisite_validation: 0,
        subgroup_performance: 0,
        prospective_evaluation: 0,
        post_market_monitoring: 0,
        limitations_boundaries: 0.5,
        local_fit: 0.5,
      },
    },
    'gi-genius': {
      label: 'GI Genius (pilot example)',
      deviceName: 'GI Genius',
      scores: {
        intended_use: 1,
        training_population: 0.5,
        validation_population: 1,
        race_ethnicity: 0,
        age: 0.5,
        sex_gender: 0,
        multisite_validation: 0.5,
        subgroup_performance: 0,
        prospective_evaluation: 0.5,
        post_market_monitoring: 0,
        limitations_boundaries: 1,
        local_fit: 0.5,
      },
    },
    'rapid-ich': {
      label: 'Rapid ICH (pilot example)',
      deviceName: 'Rapid ICH',
      scores: {
        intended_use: 1,
        training_population: 0,
        validation_population: 0.5,
        race_ethnicity: 0,
        age: 0,
        sex_gender: 0,
        multisite_validation: 0.5,
        subgroup_performance: 0,
        prospective_evaluation: 0.5,
        post_market_monitoring: 0,
        limitations_boundaries: 1,
        local_fit: 0.5,
      },
    },
    'aeye-ds': {
      label: 'AEYE-DS (pilot example)',
      deviceName: 'AEYE-DS',
      scores: {
        intended_use: 1,
        training_population: 0.5,
        validation_population: 1,
        race_ethnicity: 1,
        age: 0.5,
        sex_gender: 0.5,
        multisite_validation: 0.5,
        subgroup_performance: 0.5,
        prospective_evaluation: 0.5,
        post_market_monitoring: 0,
        limitations_boundaries: 1,
        local_fit: 0.5,
      },
    },
  };

  var state = {
    deviceName: '',
    scores: {},
    activeExample: '',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getScore(criterionId) {
    var value = state.scores[criterionId];
    return value === 0 || value === 0.5 || value === 1 ? value : null;
  }

  function getTotal() {
    var total = 0;
    var scored = 0;
    CRITERIA.forEach(function (c) {
      var score = getScore(c.id);
      if (score !== null) {
        total += score;
        scored += 1;
      }
    });
    return { total: total, scored: scored, max: CRITERIA.length };
  }

  function getBand(total) {
    for (var i = 0; i < BANDS.length; i++) {
      if (total >= BANDS[i].min && total <= BANDS[i].max) {
        return BANDS[i];
      }
    }
    return BANDS[BANDS.length - 1];
  }

  function formatScore(value) {
    if (value === null || value === undefined) return '—';
    return value % 1 === 0 ? String(value) : value.toFixed(1);
  }

  function buildExportText() {
    var totalInfo = getTotal();
    var complete = totalInfo.scored === totalInfo.max;
    var band = complete ? getBand(totalInfo.total) : null;
    var device = state.deviceName.trim() || 'Unnamed device';
    var lines = [
      'Demographic Transparency and Deployment Readiness Rubric',
      'Device: ' + device,
      'Total score: ' + formatScore(totalInfo.total) + ' / 12',
      'Interpretation: ' + (complete ? band.label : 'Incomplete (' + totalInfo.scored + ' of 12 criteria scored)'),
      '',
      'Criterion scores (0 = absent, 0.5 = partial, 1 = present):',
    ];

    CRITERIA.forEach(function (c) {
      lines.push(c.num + '. ' + c.title + ': ' + formatScore(getScore(c.id)));
    });

    lines.push('');
    lines.push('Note: This rubric measures transparency in public-facing records, not clinical fairness or harm.');
    lines.push('Source: AIFramework.site — Evaluating Fairness in FDA-Approved AI Diagnostic Tools');

    return lines.join('\n');
  }

  function setScore(criterionId, value) {
    state.scores[criterionId] = value;
    state.activeExample = '';
    updateSummary();
    updateExampleSelect();
  }

  function clearScores() {
    state.scores = {};
    state.activeExample = '';
    updateSummary();
    renderCriteria(document.getElementById('rubric-criteria'));
    updateExampleSelect();
  }

  function loadExample(exampleId) {
    var example = EXAMPLES[exampleId];
    if (!example) return;

    state.activeExample = exampleId;
    state.deviceName = example.deviceName || '';
    state.scores = {};

    if (example.scores) {
      Object.keys(example.scores).forEach(function (key) {
        state.scores[key] = example.scores[key];
      });
    }

    var deviceInput = document.getElementById('rubric-device-name');
    if (deviceInput) deviceInput.value = state.deviceName;

    renderCriteria(document.getElementById('rubric-criteria'));
    updateSummary();
    updateExampleSelect();
  }

  function updateExampleSelect() {
    var select = document.getElementById('rubric-example-select');
    if (!select) return;
    select.value = state.activeExample;
  }

  function updateSummary() {
    var totalEl = document.getElementById('rubric-total');
    var progressEl = document.getElementById('rubric-progress');
    var bandEl = document.getElementById('rubric-band');
    var bandNoteEl = document.getElementById('rubric-band-note');
    if (!totalEl || !bandEl) return;

    var totalInfo = getTotal();
    var complete = totalInfo.scored === totalInfo.max;

    totalEl.textContent = formatScore(totalInfo.total);
    if (progressEl) {
      progressEl.textContent =
        totalInfo.scored + ' of ' + totalInfo.max + ' criteria scored';
    }

    if (!complete) {
      bandEl.className = 'rubric-band rubric-band-pending';
      bandEl.textContent = 'In progress';
      if (bandNoteEl) {
        bandNoteEl.textContent =
          totalInfo.scored === 0
            ? 'Score each criterion based on what is visible in the public record.'
            : 'Complete all 12 criteria to see the transparency interpretation.';
      }
      return;
    }

    var band = getBand(totalInfo.total);
    bandEl.className = 'rubric-band ' + band.className;
    bandEl.textContent = band.label;

    if (bandNoteEl) {
      var notes = {
        strong: 'Public-facing evidence appears relatively complete for fairness review.',
        moderate: 'Meaningful information is visible, but important gaps remain.',
        limited: 'Transparency is thin; deployers face an elevated review burden.',
        poor: 'Fairness risk is difficult to assess responsibly from the public record.',
      };
      bandNoteEl.textContent = notes[band.key] || '';
    }
  }

  function renderCriteria(container) {
    if (!container) return;

    container.innerHTML = CRITERIA.map(function (c) {
      var current = getScore(c.id);
      var options = SCORE_OPTIONS.map(function (opt) {
        var checked = current === opt.value ? ' checked' : '';
        var inputId = 'rubric-' + c.id + '-' + String(opt.value).replace('.', '_');
        return (
          '<label class="rubric-score-option" for="' +
          inputId +
          '" title="' +
          escapeHtml(opt.title) +
          '">' +
          '<input type="radio" name="rubric-' +
          escapeHtml(c.id) +
          '" id="' +
          inputId +
          '" value="' +
          opt.value +
          '"' +
          checked +
          '>' +
          '<span>' +
          escapeHtml(opt.label) +
          '</span>' +
          '</label>'
        );
      }).join('');

      return (
        '<div class="rubric-row" data-criterion="' +
        escapeHtml(c.id) +
        '">' +
        '<div class="rubric-row-label">' +
        '<span class="rubric-row-num">' +
        escapeHtml(c.num) +
        '</span>' +
        '<span class="rubric-row-title">' +
        escapeHtml(c.title) +
        '</span>' +
        '</div>' +
        '<div class="rubric-row-scores" role="radiogroup" aria-label="' +
        escapeHtml(c.title) +
        '">' +
        options +
        '</div>' +
        '</div>'
      );
    }).join('');

    container.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.addEventListener('change', function () {
        var row = input.closest('.rubric-row');
        var criterionId = row && row.dataset.criterion;
        if (criterionId) setScore(criterionId, parseFloat(input.value));
      });
    });
  }

  function renderExampleOptions() {
    return Object.keys(EXAMPLES)
      .map(function (key) {
        var item = EXAMPLES[key];
        return (
          '<option value="' +
          escapeHtml(key) +
          '">' +
          escapeHtml(item.label) +
          '</option>'
        );
      })
      .join('');
  }

  function renderScaffold(container) {
    if (!container) return;

    container.innerHTML =
      '<div class="rubric-scorer-inner">' +
      '<div class="rubric-toolbar">' +
      '<div class="rubric-toolbar-field">' +
      '<label for="rubric-device-name">Device name</label>' +
      '<input type="text" id="rubric-device-name" class="rubric-input" placeholder="e.g., stroke triage tool under review" autocomplete="off">' +
      '</div>' +
      '<div class="rubric-toolbar-field">' +
      '<label for="rubric-example-select">Load pilot example</label>' +
      '<select id="rubric-example-select" class="rubric-select">' +
      renderExampleOptions() +
      '</select>' +
      '</div>' +
      '</div>' +
      '<div class="rubric-summary" id="rubric-summary" aria-live="polite">' +
      '<div class="rubric-summary-score">' +
      '<span class="rubric-summary-label">Total score</span>' +
      '<span class="rubric-summary-total" id="rubric-total">0</span>' +
      '<span class="rubric-summary-max">/ 12</span>' +
      '</div>' +
      '<div class="rubric-summary-meta">' +
      '<span class="rubric-band rubric-band-pending" id="rubric-band">In progress</span>' +
      '<p class="rubric-band-note" id="rubric-band-note">Score each criterion based on what is visible in the public record.</p>' +
      '<p class="rubric-progress" id="rubric-progress">0 of 12 criteria scored</p>' +
      '</div>' +
      '</div>' +
      '<div class="rubric-legend" aria-hidden="true">' +
      '<span><strong>1</strong> Clearly present</span>' +
      '<span><strong>0.5</strong> Partially present</span>' +
      '<span><strong>0</strong> Absent</span>' +
      '</div>' +
      '<div id="rubric-criteria" class="rubric-criteria"></div>' +
      '<div class="rubric-actions">' +
      '<button type="button" class="btn btn-secondary" id="rubric-copy-btn">Copy summary</button>' +
      '<button type="button" class="btn btn-secondary" id="rubric-print-btn">Print / save PDF</button>' +
      '<button type="button" class="btn btn-secondary" id="rubric-clear-btn">Clear scores</button>' +
      '</div>' +
      '<p class="rubric-disclaimer">This scorer measures transparency in public-facing records, not clinical fairness or harm. Pilot examples reflect illustrative scores from the project\'s case studies.</p>' +
      '</div>';

    document.getElementById('rubric-device-name').addEventListener('input', function (e) {
      state.deviceName = e.target.value;
      state.activeExample = '';
      updateExampleSelect();
    });

    document.getElementById('rubric-example-select').addEventListener('change', function (e) {
      loadExample(e.target.value);
    });

    document.getElementById('rubric-copy-btn').addEventListener('click', function () {
      var text = buildExportText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          var btn = document.getElementById('rubric-copy-btn');
          var original = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(function () {
            btn.textContent = original;
          }, 1800);
        });
      } else {
        window.prompt('Copy this rubric summary:', text);
      }
    });

    document.getElementById('rubric-print-btn').addEventListener('click', function () {
      document.body.classList.add('rubric-printing');
      window.print();
      setTimeout(function () {
        document.body.classList.remove('rubric-printing');
      }, 500);
    });

    document.getElementById('rubric-clear-btn').addEventListener('click', function () {
      state.deviceName = '';
      var deviceInput = document.getElementById('rubric-device-name');
      if (deviceInput) deviceInput.value = '';
      clearScores();
    });

    renderCriteria(document.getElementById('rubric-criteria'));
    updateSummary();
  }

  function initRubric() {
    renderScaffold(document.getElementById('rubric-scorer-mount'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRubric);
  } else {
    initRubric();
  }

  window.RubricScorer = {
    CRITERIA: CRITERIA,
    EXAMPLES: EXAMPLES,
    getTotal: getTotal,
    getBand: getBand,
    loadExample: loadExample,
    buildExportText: buildExportText,
    refresh: initRubric,
  };
})();