const chartThemes = {
  green: [
    "oklch(0.871 0.15 154.449)",
    "oklch(0.723 0.219 149.579)",
    "oklch(0.627 0.194 149.214)",
    "oklch(0.527 0.154 150.069)",
    "oklch(0.448 0.119 151.328)",
  ],
  blue: [
    "oklch(0.809 0.105 251.813)",
    "oklch(0.623 0.214 259.815)",
    "oklch(0.546 0.245 262.881)",
    "oklch(0.488 0.243 264.376)",
    "oklch(0.424 0.199 265.638)",
  ],
  neutral: [
    "oklch(0.646 0.222 41.116)",
    "oklch(0.6 0.118 184.704)",
    "oklch(0.398 0.07 227.392)",
    "oklch(0.828 0.189 84.429)",
    "oklch(0.769 0.188 70.08)",
  ],
  orange: [
    "oklch(0.837 0.128 66.29)",
    "oklch(0.705 0.213 47.604)",
    "oklch(0.646 0.222 41.116)",
    "oklch(0.553 0.195 38.402)",
    "oklch(0.47 0.157 37.304)",
  ],
  red: [
    "oklch(0.81 0.117 11.638)",
    "oklch(0.645 0.246 16.439)",
    "oklch(0.586 0.253 17.585)",
    "oklch(0.514 0.222 16.935)",
    "oklch(0.455 0.188 13.697)",
  ],
  rose: [
    "oklch(0.82 0.11 346)",
    "oklch(0.73 0.18 350)",
    "oklch(0.66 0.21 354)",
    "oklch(0.59 0.22 1)",
    "oklch(0.52 0.20 4)",
  ],
  violet: [
    "oklch(0.811 0.111 293.571)",
    "oklch(0.606 0.25 292.717)",
    "oklch(0.541 0.281 293.009)",
    "oklch(0.491 0.27 292.581)",
    "oklch(0.432 0.232 292.759)",
  ],
  yellow: [
    "oklch(0.905 0.182 98.111)",
    "oklch(0.795 0.184 86.047)",
    "oklch(0.681 0.162 75.834)",
    "oklch(0.554 0.135 66.442)",
    "oklch(0.476 0.114 61.907)",
  ],
};

export type ChartThemeType = keyof typeof chartThemes;
export const chartThemeNames = Object.keys(chartThemes) as ChartThemeType[];

export const getChartThemeStyles = (theme: ChartThemeType) => {
  const styles: Record<string, string> = {};
  (chartThemes[theme] ?? []).forEach((color, index) => {
    styles[`--chart-${index + 1}`] = color;
  });
  return styles as React.CSSProperties;
};
