"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Scatter,
  ScatterChart,
  Sector,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { type Chart } from "@/models/chart";
import { type ChartThemeType, getChartThemeStyles } from "./themes";

type ChartViewProps = {
  xKey: string;
  yKeys: string[];
  theme: ChartThemeType;
  id: Chart["id"];
  type: Chart["type"];
  chartData: Record<string, any>[];
  labels: Record<string, string>;
  className?: string;
};

function getColorByIndex(index: number) {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  return colors[index % colors.length];
}

export function ChartView({
  xKey,
  yKeys,
  theme,
  id,
  type,
  chartData,
  labels,
  className,
}: ChartViewProps) {
  const primaryYKey = yKeys[0];
  const zKey = yKeys[1];

  const chartConfig = Object.fromEntries(
    yKeys.map((axis, idx) => [
      axis,
      {
        label: labels[axis] || axis,
        color: getColorByIndex(idx),
      },
    ]),
  ) satisfies ChartConfig;

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            responsive
            accessibilityLayer
            data={chartData}
            className="w-full aspect-video"
          >
            <CartesianGrid vertical={false} />
            {xKey ? <XAxis dataKey={xKey} /> : null}
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Line
                key={`${id}-${key}`}
                dataKey={key}
                name={key}
                stroke={getColorByIndex(idx)}
                strokeWidth={2}
                type="natural"
                dot={{
                  fill: getColorByIndex(idx),
                }}
                activeDot={{
                  r: 6,
                }}
              />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart
            responsive
            accessibilityLayer
            data={chartData}
            className="w-full aspect-video"
          >
            <defs>
              {yKeys.map((key, idx) => (
                <linearGradient
                  key={`lineargradient-${key}`}
                  id={`fillArea${idx}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={getColorByIndex(idx)}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={getColorByIndex(idx)}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid />
            {xKey ? <XAxis dataKey={xKey} /> : null}
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Area
                key={`${id}-${key}`}
                type="natural"
                dataKey={key}
                name={key}
                fill={`url(#fillArea${idx})`}
                stroke={getColorByIndex(idx)}
              />
            ))}
          </AreaChart>
        );
      case "scatter":
        return (
          <ScatterChart
            responsive
            accessibilityLayer
            data={chartData}
            className="w-full aspect-video"
          >
            <CartesianGrid />
            {xKey ? <XAxis dataKey={xKey} /> : null}
            <YAxis dataKey={primaryYKey} />
            {zKey ? <ZAxis dataKey={zKey} range={[60, 300]} /> : null}
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Scatter
                key={`${id}-${key}`}
                dataKey={key}
                name={key}
                fill={getColorByIndex(idx)}
              />
            ))}
          </ScatterChart>
        );
      case "pie":
        if (!primaryYKey) return null;
        return (
          <PieChart
            responsive
            accessibilityLayer
            className="w-full aspect-video"
          >
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie
              data={chartData}
              dataKey={primaryYKey}
              nameKey={xKey}
              label
              shape={(props) => {
                const index = props.index ?? 0;
                return <Sector {...props} fill={getColorByIndex(index)} />;
              }}
            />
          </PieChart>
        );
      case "radar":
        const showCircle =
          new Set(chartData.map((entry) => entry[xKey])).size > 10;
        return (
          <RadarChart
            responsive
            accessibilityLayer
            data={chartData}
            className="w-full aspect-video"
          >
            <PolarGrid gridType={showCircle ? "circle" : "polygon"} />
            <PolarAngleAxis dataKey={xKey} />
            <PolarRadiusAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Radar
                key={`${id}-${key}`}
                dataKey={key}
                name={key}
                stroke={getColorByIndex(idx)}
                fill={getColorByIndex(idx)}
                fillOpacity={0.3}
                dot={{
                  r: 4,
                  fillOpacity: 1,
                }}
              />
            ))}
          </RadarChart>
        );
      case "radial":
        if (!primaryYKey) return null;
        return (
          <RadialBarChart
            responsive
            accessibilityLayer
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            className="w-full aspect-video"
          >
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <RadialBar
              dataKey={primaryYKey}
              name={primaryYKey}
              background
              shape={(props) => {
                // as temporary solution, always use index 0
                const index = 0;
                return (
                  <path {...props} fill={getColorByIndex(index)} d={props.d} />
                );
              }}
            />
          </RadialBarChart>
        );
      case "bar":
      default:
        const showRadius =
          new Set(chartData.map((entry) => entry[xKey])).size <= 10;
        return (
          <BarChart
            responsive
            accessibilityLayer
            data={chartData}
            className="w-full aspect-video"
          >
            <CartesianGrid vertical={false} />
            {xKey ? <XAxis dataKey={xKey} /> : null}
            {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            {yKeys.map((key, idx) => (
              <Bar
                key={`${id}-${key}`}
                dataKey={key}
                name={key}
                fill={getColorByIndex(idx)}
                radius={showRadius ? 8 : 0}
              />
            ))}
          </BarChart>
        );
    }
  };

  const chartElement = renderChart();
  if (!chartElement) return null;

  return (
    <ChartContainer
      style={getChartThemeStyles(theme)}
      id={id}
      config={chartConfig}
      className={className}
    >
      {chartElement}
    </ChartContainer>
  );
}

//  return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle>{chart.name}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer
//           style={getChartThemeStyles(
//             chart.config.customization.theme as ChartThemeType,
//           )}
//           id={chart.id}
//           config={chartConfig}
//         >
//           {renderChart()!}
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
