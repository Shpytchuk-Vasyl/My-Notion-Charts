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
  Cell,
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
  XAxis,
  YAxis,
  ZAxis,
} from "@/lib/recharts";
import { type Chart } from "@/models/chart";
import { type ChartThemeType, getChartThemeStyles } from "./themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotionService } from "@/services/notion";

type ChartViewProps = {
  chart: Chart & { workspaces: { access_token: string } };
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

export async function ChartView({ chart, className = "" }: ChartViewProps) {
  const { data, error } = await new NotionService(
    chart.workspaces.access_token,
  ).getChartData(chart);

  if (error) {
    return <div>Error loading chart data: {error}</div>;
  }

  // const chartData = (data ?? []) as Record<string, unknown>[];
  const xKey = chart.config.axis.x?.property;
  const yKeys = chart.config.axis.y.map((axis) => axis.property);
  const primaryYKey = yKeys[0];
  const zKey = yKeys[1];
  // testing data
  const chartData = Array.from({ length: 10 }).map((_, idx) => {
    const entry: Record<string, unknown> = {};
    if (xKey) {
      entry[xKey] = idx;
    }
    yKeys.forEach((key) => {
      entry[key] = Math.floor(Math.random() * 100) + 1;
    });
    return entry;
  });

  const chartConfig = Object.fromEntries(
    chart.config.axis.y.map((axis, idx) => [
      axis.property,
      {
        label: axis.property,
        color: getColorByIndex(idx),
      },
    ]),
  ) satisfies ChartConfig;

  const renderChart = () => {
    switch (chart.type) {
      case "line":
        return (
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            {xKey ? <XAxis dataKey={xKey} /> : null}
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Line
                key={`${chart.id}-${key}`}
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
          <AreaChart accessibilityLayer data={chartData}>
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
                key={`${chart.id}-${key}`}
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
          <ScatterChart accessibilityLayer data={chartData}>
            <CartesianGrid />
            {xKey ? <XAxis dataKey={xKey} /> : null}
            <YAxis dataKey={primaryYKey} />
            {zKey ? <ZAxis dataKey={zKey} range={[60, 300]} /> : null}
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Scatter
                key={`${chart.id}-${key}`}
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
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie data={chartData} dataKey={primaryYKey} nameKey={xKey} label>
              {chartData.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={getColorByIndex(idx)} />
              ))}
            </Pie>
          </PieChart>
        );
      case "radar":
        const showCircle =
          new Set(chartData.map((entry) => entry[xKey])).size > 10;
        return (
          <RadarChart accessibilityLayer data={chartData}>
            <PolarGrid gridType={showCircle ? "circle" : "polygon"} />
            <PolarAngleAxis dataKey={xKey} />
            <PolarRadiusAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Radar
                key={`${chart.id}-${key}`}
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
            accessibilityLayer
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
          >
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <RadialBar dataKey={primaryYKey} name={primaryYKey} background>
              {chartData.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={getColorByIndex(idx)} />
              ))}
            </RadialBar>
          </RadialBarChart>
        );
      case "bar":
      default:
        const showRadius =
          new Set(chartData.map((entry) => entry[xKey])).size <= 10;
        return (
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            {xKey ? <XAxis dataKey={xKey} /> : null}
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yKeys.map((key, idx) => (
              <Bar
                key={`${chart.id}-${key}`}
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

  return (
    <ChartContainer
      style={getChartThemeStyles(
        chart.config.customization.theme as ChartThemeType,
      )}
      id={chart.id}
      config={chartConfig}
    >
      {renderChart()!}
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
