import { type Chart } from "@/models/chart";

type ChartViewProps = {
  chart: Chart;
};

export function ChartView({ chart }: ChartViewProps) {
  return <div>Chart View: {chart.name}</div>;
}
