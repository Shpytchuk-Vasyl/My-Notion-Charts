import { ChartType } from "@/models/chart";
import {
  AreaChart,
  BarChart,
  LineChart,
  LucideIcon,
  PieChart,
  Radar,
  ScatterChart,
} from "lucide-react";

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
  ...rest
}: { type: ChartType } & React.ComponentProps<LucideIcon>) => {
  const IconComponent = chartIcons[type] || BarChart;
  return <IconComponent {...rest} />;
};
