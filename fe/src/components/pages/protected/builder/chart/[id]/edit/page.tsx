'use client'
import { ChartView, type ChartViewProps } from "@/components/block/chart/view";
import { useBuilderContext } from "../../../context";

export function ChartEditPage({
  xKey,
  yKeys,
  theme,
  id,
  type,
  labels,
  chartData
}: Omit<ChartViewProps, "className">) {


  const {theme: themeFromContext, type: typeFromContext} = useBuilderContext()

  return (
    <ChartView
      xKey={xKey}
      yKeys={yKeys}
      theme={themeFromContext as ChartViewProps['theme'] || theme}
      id={id}
      type={typeFromContext || type }
      chartData={chartData}
      labels={labels}
      className="bg-card border m-4 p-6 rounded-xl shadow-sm max-h-[calc(100%-(--spacing(8)))]"
    />
  );
}
