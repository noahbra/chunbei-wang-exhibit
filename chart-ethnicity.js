/* ============================================================
   Slide 12 (Rate of New Entrepreneurs by Ethnicity, Fig 3)
   Slide 13 (Opportunity Share by Ethnicity, Fig 10)

   Comparison lines fade in (no draw); Latino line draws in
   over a longer duration in full saturation orange.
   ============================================================ */

(function () {
  // -- Shared chart geometry ----------------------------------------------
  const W = 1280;
  const H = 540;
  const M = { top: 50, right: 200, bottom: 80, left: 130 };
  const innerW = W - M.left - M.right;
  const innerH = H - M.top - M.bottom;

  function makePath(years, values, xScale, yScale) {
    return values
      .map((v, i) => (i === 0 ? "M" : "L") + xScale(years[i]).toFixed(1) + "," + yScale(v).toFixed(1))
      .join(" ");
  }

  // -- Data: Rate of New Entrepreneurs by Ethnicity (Fig 3, 1996-2025) ----
  // Estimated from the published Kauffman Figure 3 chart.
  const RATE_YEARS = []; for (let y = 1996; y <= 2025; y++) RATE_YEARS.push(y);
  const RATE_LATINO = [
    0.0029, 0.0023, 0.0026, 0.0021, 0.0022, 0.0026, 0.0030, 0.0040, 0.0033, 0.0031,
    0.0036, 0.0036, 0.0046, 0.0050, 0.0056, 0.0049, 0.0050, 0.0038, 0.0046, 0.0045,
    0.0050, 0.0050, 0.0050, 0.0044, 0.0052, 0.0053, 0.0055, 0.0059, 0.0050, 0.0053,
    0.0050, 0.0048, 0.0055, 0.0052,
  ].slice(0, 30);
  const RATE_WHITE = [
    0.0033, 0.0030, 0.0030, 0.0029, 0.0027, 0.0029, 0.0030, 0.0030, 0.0030, 0.0029,
    0.0030, 0.0029, 0.0030, 0.0033, 0.0037, 0.0030, 0.0030, 0.0028, 0.0029, 0.0033,
    0.0030, 0.0033, 0.0030, 0.0030, 0.0035, 0.0035, 0.0033, 0.0033, 0.0028, 0.0030,
  ].slice(0, 30);
  const RATE_ASIAN = [
    0.0030, 0.0028, 0.0030, 0.0028, 0.0027, 0.0028, 0.0030, 0.0033, 0.0029, 0.0029,
    0.0035, 0.0033, 0.0033, 0.0031, 0.0035, 0.0033, 0.0030, 0.0028, 0.0030, 0.0033,
    0.0030, 0.0033, 0.0034, 0.0031, 0.0035, 0.0036, 0.0033, 0.0030, 0.0029, 0.0029,
  ].slice(0, 30);
  const RATE_BLACK = [
    0.0021, 0.0023, 0.0024, 0.0022, 0.0022, 0.0023, 0.0024, 0.0023, 0.0023, 0.0022,
    0.0023, 0.0024, 0.0023, 0.0026, 0.0023, 0.0023, 0.0024, 0.0023, 0.0024, 0.0024,
    0.0023, 0.0026, 0.0028, 0.0026, 0.0036, 0.0033, 0.0027, 0.0025, 0.0030, 0.0044,
  ].slice(0, 30);

  // -- Data: Opportunity Share by Ethnicity (Fig 10, 1998-2025) -----------
  const OPP_YEARS = []; for (let y = 1998; y <= 2025; y++) OPP_YEARS.push(y);
  const OPP_LATINO = [
    0.74, 0.77, 0.84, 0.83, 0.79, 0.71, 0.69, 0.71, 0.78, 0.78, 0.74, 0.71, 0.70,
    0.68, 0.74, 0.74, 0.79, 0.81, 0.81, 0.84, 0.81, 0.79, 0.81, 0.74, 0.81, 0.83,
    0.81, 0.81,
  ].slice(0, 28);
  const OPP_ASIAN = [
    0.84, 0.82, 0.86, 0.86, 0.80, 0.80, 0.79, 0.80, 0.85, 0.84, 0.86, 0.87, 0.86,
    0.86, 0.86, 0.85, 0.86, 0.87, 0.89, 0.91, 0.93, 0.86, 0.80, 0.81, 0.86, 0.91,
    0.93, 0.92,
  ].slice(0, 28);
  const OPP_WHITE = [
    0.83, 0.82, 0.85, 0.85, 0.81, 0.79, 0.79, 0.81, 0.83, 0.82, 0.81, 0.79, 0.78,
    0.76, 0.78, 0.81, 0.83, 0.85, 0.85, 0.86, 0.86, 0.81, 0.80, 0.84, 0.86, 0.85,
    0.84, 0.84,
  ].slice(0, 28);
  const OPP_BLACK = [
    0.67, 0.71, 0.79, 0.78, 0.73, 0.69, 0.69, 0.72, 0.78, 0.80, 0.77, 0.74, 0.74,
    0.74, 0.76, 0.78, 0.78, 0.84, 0.83, 0.84, 0.85, 0.78, 0.74, 0.79, 0.78, 0.81,
    0.81, 0.81,
  ].slice(0, 28);

  // -- Color tokens -------------------------------------------------------
  const ORANGE = '#F07923';
  const GRAY_LINE = '#9A8B7E';
  const TEXT = '#4F453D';

  // -- Generic chart renderer ---------------------------------------------
  function buildChart(opts) {
    const {
      yearStart, yearEnd, yMin, yMax, yTicks, yFmt, yLabel,
      heroData, heroLabel, heroEnd,
      otherSeries,           // [{ name, data, label, labelOffset }]
      shadeStart, shadeEnd, shadeLabel,
      annotation,            // { x, y, text } in data coords
    } = opts;

    const xScale = y => M.left + ((y - yearStart) / (yearEnd - yearStart)) * innerW;
    const yScale = v => M.top + (1 - (v - yMin) / (yMax - yMin)) * innerH;

    const xTicks = [];
    for (let y = Math.ceil(yearStart / 5) * 5; y <= yearEnd; y += 5) xTicks.push(y);
    if (xTicks[xTicks.length - 1] !== yearEnd) xTicks.push(yearEnd);

    const years = []; for (let y = yearStart; y <= yearEnd; y++) years.push(y);

    return `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block; width:100%; height:auto;">

  <!-- Y-axis grid + labels -->
  ${yTicks.map(v => `
    <line x1="${M.left}" x2="${M.left + innerW}" y1="${yScale(v)}" y2="${yScale(v)}"
          stroke="#000" stroke-opacity="0.08" stroke-width="1"
          stroke-dasharray="${v === yMin || v === yMax ? '0' : '4 4'}" />
    <text x="${M.left - 22}" y="${yScale(v) + 9}"
          text-anchor="end"
          font-family="Inter Tight, sans-serif"
          font-size="26" font-weight="500" fill="${TEXT}" opacity="0.7">${yFmt(v)}</text>
  `).join('')}

  <!-- X-axis ticks -->
  ${xTicks.map(y => `
    <text x="${xScale(y)}" y="${M.top + innerH + 38}"
          text-anchor="middle"
          font-family="Inter Tight, sans-serif"
          font-size="26" font-weight="500" fill="${TEXT}" opacity="0.85">${y}</text>
  `).join('')}
  <!-- Y-axis label -->
  <text x="${M.left - 95}" y="${M.top + innerH / 2}"
        text-anchor="middle"
        transform="rotate(-90 ${M.left - 95} ${M.top + innerH / 2})"
        font-family="Inter Tight, sans-serif"
        font-size="26" font-weight="600" fill="${TEXT}"
        letter-spacing="0.1em">${yLabel}</text>

  <!-- Enforcement-intensification shaded band -->
  ${shadeStart != null ? `
  <rect x="${xScale(shadeStart)}" y="${M.top}"
        width="${xScale(shadeEnd) - xScale(shadeStart)}" height="${innerH}"
        fill="${ORANGE}" opacity="0.12" class="shade-band" />
  <text x="${(xScale(shadeStart) + xScale(shadeEnd)) / 2}" y="${M.top + 32}"
        text-anchor="middle"
        font-family="Inter Tight, sans-serif"
        font-size="26" font-weight="600" fill="${ORANGE}"
        letter-spacing="0.08em" opacity="0.85" class="shade-label">${shadeLabel}</text>
  ` : ''}

  <!-- Comparison (other) lines — render first so hero is on top -->
  ${otherSeries.map((s, i) => `
    <g class="other-line" data-other-idx="${i}" opacity="0.85">
      <path d="${makePath(years, s.data, xScale, yScale)}"
            fill="none"
            stroke="${GRAY_LINE}"
            stroke-width="2.5"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.55"/>
      <text x="${xScale(yearEnd) + 12}"
            y="${yScale(s.data[s.data.length - 1]) + (s.labelOffset || 0)}"
            font-family="Inter Tight, sans-serif"
            font-size="26" font-weight="600" fill="${GRAY_LINE}"
            opacity="0.85">${s.label}</text>
    </g>
  `).join('')}

  <!-- Hero (Latino) line — drawn last, on top -->
  <path d="${makePath(years, heroData, xScale, yScale)}"
        fill="none"
        stroke="${ORANGE}"
        stroke-width="5"
        stroke-linejoin="round"
        stroke-linecap="round"
        class="hero-line"/>

  <!-- Hero endpoint label -->
  <g class="hero-end" opacity="1">
    <circle cx="${xScale(yearEnd)}" cy="${yScale(heroData[heroData.length - 1])}" r="8" fill="${ORANGE}"/>
    <text x="${xScale(yearEnd) + 14}"
          y="${yScale(heroData[heroData.length - 1]) + 9}"
          font-family="Inter Tight, sans-serif"
          font-size="30" font-weight="700" fill="${ORANGE}">${heroLabel}</text>
  </g>

  <!-- Hero annotation -->
  ${annotation ? `
  <g class="hero-annot" opacity="0.9">
    <text x="${xScale(annotation.x)}" y="${yScale(annotation.y)}"
          text-anchor="middle"
          font-family="Inter Tight, sans-serif"
          font-size="28" font-style="italic" font-weight="500" fill="${ORANGE}">${annotation.text}</text>
  </g>
  ` : ''}

</svg>
    `;
  }

  // -- Slide 12: Rate by ethnicity ----------------------------------------
  function drawRate(target) {
    const svg = buildChart({
      yearStart: 1996, yearEnd: 2025,
      yMin: 0, yMax: 0.006,
      yTicks: [0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006],
      yFmt: v => (v * 100).toFixed(1) + '%',
      yLabel: 'RATE OF NEW ENTREPRENEURS',
      heroData: RATE_LATINO,
      heroLabel: 'Latino',
      otherSeries: [
        { name: 'asian', data: RATE_ASIAN, label: 'Asian', labelOffset: -10 },
        { name: 'white', data: RATE_WHITE, label: 'White', labelOffset: 28 },
        { name: 'black', data: RATE_BLACK, label: 'Black', labelOffset: 28 },
      ],
      shadeStart: 2002, shadeEnd: 2011,
      shadeLabel: 'ENFORCEMENT INTENSIFIES',
      annotation: { x: 2006.5, y: 0.0010, text: 'Entry rate doubles' },
    });
    target.innerHTML = svg;
  }

  // -- Slide 13: Opportunity share by ethnicity ---------------------------
  function drawOpp(target) {
    const svg = buildChart({
      yearStart: 1998, yearEnd: 2025,
      yMin: 0.55, yMax: 0.95,
      yTicks: [0.55, 0.65, 0.75, 0.85, 0.95],
      yFmt: v => Math.round(v * 100) + '%',
      yLabel: 'OPPORTUNITY SHARE',
      heroData: OPP_LATINO,
      heroLabel: 'Latino',
      otherSeries: [
        { name: 'asian', data: OPP_ASIAN, label: 'Asian', labelOffset: -8 },
        { name: 'white', data: OPP_WHITE, label: 'White', labelOffset: 8 },
        { name: 'black', data: OPP_BLACK, label: 'Black', labelOffset: 50 },
      ],
      shadeStart: 2003, shadeEnd: 2011,
      shadeLabel: 'ENFORCEMENT INTENSIFIES',
      annotation: { x: 2007, y: 0.62, text: 'Lowest of any group' },
    });
    target.innerHTML = svg;
  }

  // -- Animation player (shared) ------------------------------------------
  // Animates the chart elements in. Uses CSS transitions + setTimeout so
  // it survives iframe throttling. The chart's resting/final state is
  // always fully visible (no opacity:0 baked into SVG); play() temporarily
  // hides elements via inline style, then animates them back in.
  function play(slide) {
    const root = slide.querySelector('.chart-root');
    if (!root) return;
    const heroLine = root.querySelector('.hero-line');
    const heroEnd = root.querySelector('.hero-end');
    const heroAnnot = root.querySelector('.hero-annot');
    const others = [...root.querySelectorAll('.other-line')];
    const shadeBand = root.querySelector('.shade-band');
    const shadeLabel = root.querySelector('.shade-label');

    // Reset to hidden state (all at once, with no transition)
    if (heroLine) {
      const len = heroLine.getTotalLength();
      heroLine.style.transition = 'none';
      heroLine.style.strokeDasharray = len;
      heroLine.style.strokeDashoffset = len;
    }
    [heroEnd, heroAnnot, shadeBand, shadeLabel, ...others].forEach(el => {
      if (!el) return;
      el.style.transition = 'none';
      el.style.opacity = 0;
    });
    // Force a reflow so the resets apply before transitions
    void root.offsetWidth;

    // 1. Comparison lines fade in (slow, gentle, all together)
    others.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 1.4s ease-out';
        el.style.opacity = 0.85;
      }, 200 + i * 80);
    });

    // 2. Latino line draws in
    setTimeout(() => {
      if (heroLine) {
        heroLine.style.transition = 'stroke-dashoffset 3.2s cubic-bezier(0.5, 0, 0.2, 1)';
        heroLine.style.strokeDashoffset = 0;
      }
    }, 1700);

    // 3. Enforcement band fades in mid-draw
    setTimeout(() => {
      if (shadeBand) {
        shadeBand.style.transition = 'opacity 1s ease';
        shadeBand.style.opacity = 0.12;
      }
      if (shadeLabel) {
        shadeLabel.style.transition = 'opacity 1s ease';
        shadeLabel.style.opacity = 0.85;
      }
    }, 3000);

    // 4. Hero endpoint dot + annotation fade in last
    setTimeout(() => {
      if (heroEnd) {
        heroEnd.style.transition = 'opacity 0.8s ease';
        heroEnd.style.opacity = 1;
      }
      if (heroAnnot) {
        heroAnnot.style.transition = 'opacity 0.8s ease';
        heroAnnot.style.opacity = 0.9;
      }
    }, 4800);
  }

  window.EthnicityCharts = { drawRate, drawOpp, play };
})();
