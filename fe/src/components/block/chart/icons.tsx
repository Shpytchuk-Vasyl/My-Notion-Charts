import {
  AreaChart,
  BarChart,
  LineChart,
  type LucideIcon,
  PieChart,
  Radar,
  ScatterChart,
} from "lucide-react";
import type { ChartType } from "@/models/chart";

export const chartIcons: Record<ChartType, LucideIcon> = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
  radar: Radar,
  area: AreaChart,
  radial: Radar,
} as const;

export const ChartIcon = ({
  type,
  is_public = false,
  ...rest
}: {
  type: ChartType;
  is_public: boolean;
} & React.ComponentProps<LucideIcon>) => {
  const IconComponent = chartIcons[type] || BarChart;

  if (is_public)
    return (
      <>
        <span
          className="absolute size-2 rounded-full bg-green-500 animate-pulse"
          style={{
            positionAnchor: "--chart-icon",
            right: "calc(anchor(right) - var(--spacing))",
            top: "calc(anchor(top) - var(--spacing))",
          }}
        />
        <IconComponent
          {...rest}
          style={{
            anchorName: "--chart-icon",
            ...rest.style,
          }}
        />
      </>
    );

  return <IconComponent {...rest} />;
};
