/* ============================================================
   Animated entry-rate chart for Slide 2
   Recreates the original Stata plot with brand styling.
   Data points read from chart_original.png by visual estimation.
   ============================================================ */

(function () {
  // x: years 1994..2024 (31 points, but original is annual, shows roughly 30 points)
  // Approximated from the original chart.
  const years = [];
  for (let y = 1994; y <= 2024; y++) years.push(y);

  // Immigrant entry rate (per 100, expressed as fractions matching .004–.010 axis)
  const immigrants = [
    0.0064, 0.0058, 0.0050, 0.0053, 0.0050, 0.0054,
    0.0050, 0.0055, 0.0062, 0.0057, 0.0058, 0.0061, 0.0063, 0.0055,
    0.0061, 0.0080, 0.0084, 0.0089, 0.0083, 0.0080,
    0.0077, 0.0070, 0.0078, 0.0083, 0.0080, 0.0084, 0.0084,
    0.0076, 0.0083, 0.0099, 0.0099, 0.0090, 0.0092,
  ].slice(0, 31);

  const natives = [
    0.0057, 0.0055, 0.0048, 0.0048, 0.0047, 0.0046,
    0.0046, 0.0049, 0.0050, 0.0049, 0.0050, 0.0051, 0.0050, 0.0049,
    0.0050, 0.0055, 0.0049, 0.0048, 0.0048, 0.0050,
    0.0049, 0.0049, 0.0049, 0.0055, 0.0054, 0.0050, 0.0052,
    0.0052, 0.0061, 0.0058, 0.0050, 0.0053, 0.0055,
  ].slice(0, 31);

  // Chart dimensions (within slide content area)
  const W = 1280;
  const H = 720;
  const M = { top: 60, right: 220, bottom: 90, left: 130 };
  const innerW = W - M.left - M.right;
  const innerH = H - M.top - M.bottom;

  const yMin = 0.004;
  const yMax = 0.010;

  function xScale(y) {
    return M.left + ((y - 1994) / (2024 - 1994)) * innerW;
  }
  function yScale(v) {
    return M.top + (1 - (v - yMin) / (yMax - yMin)) * innerH;
  }

  function makePath(values) {
    return values
      .map((v, i) => {
        const x = xScale(years[i]);
        const y = yScale(v);
        return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
      })
      .join(" ");
  }

  function drawChart(target) {
    const svg = `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block; width:100%; height:auto;">
  <!-- y-axis grid -->
  ${[0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.010]
    .map(
      (v) => `
    <line x1="${M.left}" x2="${M.left + innerW}" y1="${yScale(v)}" y2="${yScale(v)}"
          stroke="#000" stroke-opacity="0.08" stroke-width="1"
          stroke-dasharray="${v === 0.004 || v === 0.010 ? '0' : '4 4'}" />
    <text x="${M.left - 22}" y="${yScale(v) + 7}"
          text-anchor="end"
          font-family="Inter Tight, sans-serif"
          font-size="28" font-weight="500" fill="#4F453D" opacity="0.7">
      ${v === 0.010 ? '1.0%' : (v * 100).toFixed(1) + '%'}
    </text>`
    )
    .join("")}

  <!-- x-axis ticks -->
  ${[1994, 1999, 2004, 2009, 2014, 2019, 2024]
    .map(
      (y) => `
    <text x="${xScale(y)}" y="${M.top + innerH + 38}"
          text-anchor="middle"
          font-family="Inter Tight, sans-serif"
          font-size="28" font-weight="500" fill="#4F453D" opacity="0.85">${y}</text>`
    )
    .join("")}

  <!-- y-axis label -->
  <text x="${M.left - 95}" y="${M.top + innerH / 2}"
        text-anchor="middle"
        transform="rotate(-90 ${M.left - 95} ${M.top + innerH / 2})"
        font-family="Inter Tight, sans-serif"
        font-size="28" font-weight="600" fill="#4F453D"
        letter-spacing="0.1em">ENTRY RATE</text>

  <!-- x-axis label -->
  <text x="${M.left + innerW / 2}" y="${M.top + innerH + 78}"
        text-anchor="middle"
        font-family="Inter Tight, sans-serif"
        font-size="28" font-weight="600" fill="#4F453D"
        letter-spacing="0.1em">YEAR</text>

  <!-- Shaded "gap widens" region post-2007 -->
  <rect x="${xScale(2007)}" y="${M.top}"
        width="${xScale(2024) - xScale(2007)}" height="${innerH}"
        fill="url(#gapShade)" opacity="0.45" class="gap-shade" />

  <defs>
    <linearGradient id="gapShade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#F07923" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#F07923" stop-opacity="0.02"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
  </defs>

  <!-- Natives line (drawn first, behind) -->
  <path d="${makePath(natives)}"
        fill="none"
        stroke="#A55B4A"
        stroke-width="3.5"
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-dasharray="2200"
        stroke-dashoffset="2200"
        class="line-natives"/>

  <!-- Immigrants line (hero) -->
  <path d="${makePath(immigrants)}"
        fill="none"
        stroke="#3579BD"
        stroke-width="5"
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-dasharray="2200"
        stroke-dashoffset="2200"
        class="line-immigrants"/>

  <!-- Endpoint dots & labels -->
  <g class="endpoint-natives" opacity="0">
    <circle cx="${xScale(2024)}" cy="${yScale(natives[natives.length - 1])}" r="7" fill="#A55B4A"/>
    <text x="${xScale(2024) + 16}" y="${yScale(natives[natives.length - 1]) + 8}"
          font-family="Inter Tight, sans-serif"
          font-size="32" font-weight="600" fill="#A55B4A">U.S.-born</text>
  </g>
  <g class="endpoint-immigrants" opacity="0">
    <circle cx="${xScale(2024)}" cy="${yScale(immigrants[immigrants.length - 1])}" r="9" fill="#3579BD"/>
    <text x="${xScale(2024) + 18}" y="${yScale(immigrants[immigrants.length - 1]) + 9}"
          font-family="Inter Tight, sans-serif"
          font-size="34" font-weight="700" fill="#3579BD">Immigrants</text>
  </g>

  <!-- Annotation: "gap widens after mid-2000s" -->
  <g class="gap-annot" opacity="0">
    <line x1="${xScale(2007)}" x2="${xScale(2007)}"
          y1="${M.top}" y2="${M.top + innerH}"
          stroke="#F07923" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.7"/>
    <text x="${xScale(2007) + 14}" y="${M.top + 32}"
          font-family="Inter Tight, sans-serif"
          font-size="28" font-weight="600" fill="#F07923"
          letter-spacing="0.04em">↳ Gap widens</text>
  </g>
</svg>
    `;
    target.innerHTML = svg;

    // Get computed lengths and animate
    const immLine = target.querySelector('.line-immigrants');
    const natLine = target.querySelector('.line-natives');
    if (immLine && natLine) {
      const immLen = immLine.getTotalLength();
      const natLen = natLine.getTotalLength();
      immLine.style.strokeDasharray = immLen;
      immLine.style.strokeDashoffset = immLen;
      natLine.style.strokeDasharray = natLen;
      natLine.style.strokeDashoffset = natLen;
    }

    return target;
  }

  // Trigger animation when slide becomes active
  function play(slide) {
    const root = slide.querySelector('.chart-root');
    if (!root) return;
    const immLine = root.querySelector('.line-immigrants');
    const natLine = root.querySelector('.line-natives');
    const endN = root.querySelector('.endpoint-natives');
    const endI = root.querySelector('.endpoint-immigrants');
    const gap = root.querySelector('.gap-annot');
    const shade = root.querySelector('.gap-shade');

    // reset
    [immLine, natLine].forEach((l) => {
      if (!l) return;
      const len = l.getTotalLength();
      l.style.transition = 'none';
      l.style.strokeDashoffset = len;
    });
    if (shade) { shade.style.transition = 'none'; shade.style.opacity = 0; }
    [endN, endI, gap].forEach((g) => { if (g) { g.style.transition = 'none'; g.style.opacity = 0; } });

    // force reflow
    void root.offsetWidth;

    // animate natives first
    if (natLine) {
      natLine.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(0.5, 0, 0.2, 1)';
      natLine.style.strokeDashoffset = 0;
    }
    setTimeout(() => {
      if (immLine) {
        immLine.style.transition = 'stroke-dashoffset 3.2s cubic-bezier(0.5, 0, 0.2, 1)';
        immLine.style.strokeDashoffset = 0;
      }
    }, 600);
    setTimeout(() => {
      if (shade) { shade.style.transition = 'opacity 1.2s ease'; shade.style.opacity = 0.45; }
      if (gap) { gap.style.transition = 'opacity 1s ease'; gap.style.opacity = 1; }
    }, 2400);
    setTimeout(() => {
      [endN, endI].forEach((g) => { if (g) { g.style.transition = 'opacity 0.8s ease'; g.style.opacity = 1; } });
    }, 3300);
  }

  window.EntryRateChart = { drawChart, play };
})();
