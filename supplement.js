/**
 * Research supplement: glossary and limitations/methodology.
 * Loaded by index.html; renders into #supplement-glossary and #supplement-limitations.
 */
(function () {
  'use strict';

  const GLOSSARY = [
    {
      term: 'FDA clearance / approval',
      definition:
        'A regulatory decision that allows a medical device to be marketed in the United States. Clearance (often via 510(k)) or approval (often via PMA or De Novo) means the FDA found the submission met applicable requirements—it does not by itself mean the tool was tested on every population that will use it in practice.',
    },
    {
      term: '510(k) clearance',
      definition:
        'A common FDA pathway in which a manufacturer shows a new device is substantially equivalent to an already legally marketed device. Many AI diagnostic tools use this route; public summaries vary in how much demographic detail they include.',
    },
    {
      term: 'De Novo classification',
      definition:
        'An FDA pathway for novel low-to-moderate-risk devices that lack a suitable predicate. Authorization still depends on evidence submitted, but the public record format may differ from a typical 510(k) summary.',
    },
    {
      term: 'PMA (Premarket Approval)',
      definition:
        'A more stringent FDA pathway usually required for higher-risk devices. Evidence expectations can be greater, but public-facing materials may still omit subgroup or demographic detail.',
    },
    {
      term: 'Public-facing record',
      definition:
        'Documentation that hospitals, researchers, journalists, and the public can access without special access—such as FDA decision summaries, labeling, and company-published study descriptions. This project measures transparency in those materials, not confidential FDA review files.',
    },
    {
      term: 'Medical AI / AI-enabled device',
      definition:
        'Software that uses data-driven methods (often machine learning) to analyze clinical data—images, signals, or records—to support detection, triage, screening, prioritization, or similar tasks in healthcare.',
    },
    {
      term: 'Algorithmic bias',
      definition:
        'Unequal or systematically worse performance for some patient groups. It can arise from unrepresentative training data, measurement differences across sites, or models learning spurious patterns (shortcut signals) that correlate with group membership but are not clinically meaningful.',
    },
    {
      term: 'Shortcut learning',
      definition:
        'When a model relies on incidental patterns in data (e.g., imaging equipment settings) instead of clinically relevant features. Analogous to passing a test by memorizing formatting cues rather than the subject matter—performance can look strong while generalization and fairness suffer.',
    },
    {
      term: 'Demographic transparency',
      definition:
        'Whether public materials clearly describe who was included in training and validation (e.g., race, ethnicity, age, sex/gender) so outside reviewers can judge representation.',
    },
    {
      term: 'Subgroup performance',
      definition:
        'Accuracy or other metrics reported separately for meaningful groups (not only one pooled number). Needed because a tool can look accurate overall while working worse for some populations.',
    },
    {
      term: 'Validation population',
      definition:
        'The patients, sites, and conditions under which a tool was tested before marketing. Helps reviewers judge whether results may generalize to other hospitals or communities.',
    },
    {
      term: 'Triage / notification tool',
      definition:
        'Software that flags urgent findings or alerts care teams (e.g., possible stroke or hemorrhage on imaging). It may not make the final diagnosis but can still affect how quickly patients receive attention.',
    },
    {
      term: 'Post-market surveillance',
      definition:
        'Ongoing monitoring of a device after it enters clinical use to detect safety, performance, or equity issues that pre-market studies may have missed.',
    },
    {
      term: 'Deployment readiness',
      definition:
        'Whether public documentation gives a hospital enough context—population studied, workflow limits, monitoring expectations—to judge if a tool fits its local setting responsibly.',
    },
    {
      term: 'Transparency rubric score',
      definition:
        'A 0–12 point score from this project’s framework measuring how much fairness-relevant information appears in public records. It assesses visibility of evidence, not whether a tool is clinically fair in practice.',
    },
  ];

  const ACRONYMS = [
    { term: 'FDA', expansion: 'U.S. Food and Drug Administration' },
    { term: 'ML', expansion: 'Machine learning' },
    { term: 'AI/ML', expansion: 'Artificial intelligence / machine learning (as used in FDA device listings)' },
    { term: 'AAMC', expansion: 'Association of American Medical Colleges' },
    { term: 'ONC', expansion: 'Office of the National Coordinator for Health Information Technology (U.S. federal health IT office)' },
    { term: 'ASTP', expansion: 'Assistant Secretary for Technology Policy (U.S. Department of Health and Human Services)' },
    { term: 'PMA', expansion: 'Premarket approval (FDA pathway)' },
    { term: 'ICH', expansion: 'Intracranial hemorrhage (bleeding inside the skull)' },
    { term: 'LVO', expansion: 'Large vessel occlusion (a type of stroke relevant to some triage tools)' },
  ];

  const LIMITATIONS = [
    'The auditing framework measures transparency in public-facing records, not actual clinical fairness or harm. A high score means evidence is easier to review; a low score means gaps are visible—it does not prove a device is unsafe or biased.',
    'Case studies are an illustrative pilot (five FDA-authorized devices), not a statistically representative sample of all AI/ML devices on the market.',
    'Scores reflect only materials that were publicly accessible at the time of review; internal FDA submissions, proprietary validation reports, and hospital-specific contracts may contain additional detail.',
    'Single-reviewer scoring was used for the pilot case studies unless otherwise noted in project documentation; scores should be treated as structured impressions, not certified regulatory judgments.',
    'Literature and regulatory guidance evolve quickly (e.g., FDA draft guidance in 2025); readers should check whether newer public records or policies supersede examples cited here.',
    'This resource is educational and policy-oriented. It is not medical, legal, or procurement advice, and it does not rate device safety for clinical adoption.',
  ];

  const METHODOLOGY = {
    overview:
      'The honors research combined documentary analysis, claim verification against public sources, development of an applied transparency rubric, and pilot application to selected FDA-facing device records. Work evolved from a broad concern about medical AI bias toward a narrower, evidence-backed question: whether public regulatory documentation supports responsible fairness review.',
    literature:
      'Peer-reviewed and grey literature (regulatory guidance, institutional reports, and empirical studies such as the 2024 NPJ Digital Medicine scoping review of 692 devices) were used to identify recurring transparency gaps and to anchor major statistics cited on this site.',
    verification:
      'Headline statistics and institutional claims were checked against primary or authoritative public sources (journal articles, AAMC releases, federal health IT reporting, FDA guidance documents) before inclusion.',
    deviceReview:
      'For each pilot case study, publicly available FDA-facing materials (e.g., decision summaries, labeling, and related public descriptions) were reviewed criterion-by-criterion against the 12-item Demographic Transparency and Deployment Readiness Rubric. Only information visibly present in those records was scored.',
    synthesis:
      'Recurring patterns across devices and literature were organized with structured comparison tables and AI-assisted drafting support; all conclusions presented here were reviewed for alignment with cited sources and the rubric logic.',
    expertInput:
      'Targeted expert outreach informed how hospitals and policy audiences interpret transparency gaps; themes from those conversations informed emphasis in the policy brief and public guide but are not presented as formal interview data.',
    scope:
      'Analysis focused on English-language, U.S. FDA-authorized AI diagnostic and triage-style tools described in the case study list. Other jurisdictions, non-AI software, and general clinical decision support without marketed AI/ML labeling were outside scope.',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderGlossary(container) {
    if (!container) return;

    const rows = GLOSSARY.map(
      (item) =>
        '<tr><td>' +
        escapeHtml(item.term) +
        '</td><td>' +
        escapeHtml(item.definition) +
        '</td></tr>'
    ).join('');

    const acronymRows = ACRONYMS.map(
      (item) =>
        '<tr><td>' +
        escapeHtml(item.term) +
        '</td><td>' +
        escapeHtml(item.expansion) +
        '</td></tr>'
    ).join('');

    container.innerHTML =
      '<p class="body-text">Key terms used across this site. Definitions are written for readers without a background in AI, medicine, or regulation.</p>' +
      '<h3 class="sub-title" style="margin-top: 32px;">Core terms</h3>' +
      '<table class="var-table" aria-label="Glossary of core terms">' +
      '<thead><tr><th>Term</th><th>Definition</th></tr></thead><tbody>' +
      rows +
      '</tbody></table>' +
      '<h3 class="sub-title" style="margin-top: 40px;">Acronyms</h3>' +
      '<p class="body-text" style="margin-bottom: 16px;">On each page, acronyms are spelled out on first use where possible. This table is a quick reference.</p>' +
      '<table class="var-table" aria-label="Acronym reference">' +
      '<thead><tr><th>Acronym</th><th>Meaning</th></tr></thead><tbody>' +
      acronymRows +
      '</tbody></table>';
  }

  function renderLimitations(container) {
    if (!container) return;

    const limitationItems = LIMITATIONS.map(
      (text) => '<li>' + escapeHtml(text) + '</li>'
    ).join('');

    container.innerHTML =
      '<p class="body-text">Explicit boundaries on what this project can and cannot conclude from public materials alone.</p>' +
      '<ul class="bullet-list" style="margin-top: 24px;">' +
      limitationItems +
      '</ul>' +
      '<h3 class="sub-title" style="margin-top: 48px;">Detailed methodology</h3>' +
      '<p class="body-text">' +
      escapeHtml(METHODOLOGY.overview) +
      '</p>' +
      '<ul class="bullet-list">' +
      '<li><strong>Literature review:</strong> ' +
      escapeHtml(METHODOLOGY.literature) +
      '</li>' +
      '<li><strong>Claim verification:</strong> ' +
      escapeHtml(METHODOLOGY.verification) +
      '</li>' +
      '<li><strong>Device record review:</strong> ' +
      escapeHtml(METHODOLOGY.deviceReview) +
      '</li>' +
      '<li><strong>Pattern synthesis:</strong> ' +
      escapeHtml(METHODOLOGY.synthesis) +
      '</li>' +
      '<li><strong>Expert input:</strong> ' +
      escapeHtml(METHODOLOGY.expertInput) +
      '</li>' +
      '<li><strong>Scope:</strong> ' +
      escapeHtml(METHODOLOGY.scope) +
      '</li>' +
      '</ul>' +
      '<div class="callout-amber" style="margin-top: 32px;">' +
      '<p><strong>How to cite this supplement:</strong> Glossary and limitations/methodology content is maintained in <code>supplement.js</code> in this repository and rendered on the About &amp; Sources page.</p>' +
      '</div>';
  }

  function initSupplement() {
    renderGlossary(document.getElementById('supplement-glossary'));
    renderLimitations(document.getElementById('supplement-limitations'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupplement);
  } else {
    initSupplement();
  }

  window.ResearchSupplement = {
    GLOSSARY: GLOSSARY,
    ACRONYMS: ACRONYMS,
    LIMITATIONS: LIMITATIONS,
    METHODOLOGY: METHODOLOGY,
    refresh: initSupplement,
  };
})();