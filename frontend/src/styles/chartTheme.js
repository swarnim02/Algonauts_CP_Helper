/**
 * Shared Chart.js theming.
 *
 * Charts render to <canvas>, where CSS custom properties do not resolve, so the
 * palette is duplicated here as literals. These values mirror the tokens in
 * index.css — update both together.
 */

export const palette = {
    bg: '#121a17',
    bgElevated: '#18231f',
    border: '#1f2e28',
    borderStrong: '#2a3d35',
    primary: '#10b981',
    accent: '#5eead4',
    text: '#ecfdf5',
    text2: '#b8cfc6',
    muted: '#8aa39b',
    faint: '#5c716a',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#38bdf8'
};

export const grid = 'rgba(236, 253, 245, 0.07)';
export const gridStrong = 'rgba(236, 253, 245, 0.12)';

/**
 * Official Codeforces rank colours, brightened for legibility on a dark
 * background. The hue mapping is preserved because competitive programmers
 * read rank by colour.
 */
export const cfRankColors = {
    newbie: '#9aa4a0',
    pupil: '#7ddf64',
    specialist: '#5eead4',
    expert: '#60a5fa',
    candidateMaster: '#c084fc',
    master: '#fbbf24',
    grandmaster: '#f87171'
};

export const cfRankOrder = [
    cfRankColors.newbie,
    cfRankColors.pupil,
    cfRankColors.specialist,
    cfRankColors.expert,
    cfRankColors.candidateMaster,
    cfRankColors.master,
    cfRankColors.grandmaster
];

/** Categorical palette for non-rank series (topics, tags). */
export const categorical = [
    '#10b981',
    '#5eead4',
    '#60a5fa',
    '#c084fc',
    '#fbbf24',
    '#fb923c',
    '#f87171',
    '#38bdf8',
    '#a3e635',
    '#f472b6',
    '#2dd4bf',
    '#94a3b8'
];

/** Slightly lighter variants used for hover states. */
export const categoricalHover = categorical.map((c) => c);

const fontMono = "'JetBrains Mono', ui-monospace, monospace";
const fontSans = "'Inter', system-ui, sans-serif";

export const tooltipStyle = {
    backgroundColor: palette.bgElevated,
    titleColor: palette.text,
    bodyColor: palette.text2,
    borderColor: palette.borderStrong,
    borderWidth: 1,
    padding: 12,
    cornerRadius: 8,
    displayColors: true,
    titleFont: { family: fontMono, size: 12, weight: '600' },
    bodyFont: { family: fontSans, size: 12 }
};

export const legendStyle = {
    labels: {
        color: palette.text2,
        font: { family: fontSans, size: 12 },
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 16,
        boxWidth: 8
    }
};

export const axisStyle = {
    ticks: {
        color: palette.muted,
        font: { family: fontMono, size: 11 }
    },
    grid: {
        color: grid,
        drawBorder: false
    },
    border: { display: false }
};

/** Base options shared by cartesian charts. */
export const baseCartesianOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { ...legendStyle, position: 'top' },
        tooltip: tooltipStyle
    },
    scales: {
        x: axisStyle,
        y: { ...axisStyle, beginAtZero: true }
    }
};

/** Base options shared by pie/doughnut charts. */
export const basePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { ...legendStyle, position: 'right' },
        tooltip: tooltipStyle
    }
};
