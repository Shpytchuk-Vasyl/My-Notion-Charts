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
      <span className="relative inline-flex after:absolute after:-right-1 after:-top-1 after:size-2 after:rounded-full after:bg-green-500 after:content-[''] after:animate-pulse">
        <IconComponent {...rest} />
      </span>
    );

  return <IconComponent {...rest} />;
};
