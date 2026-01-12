"use client";
import "gridstack/dist/gridstack.min.css";
import { type GridStackOptions } from "gridstack";
import { Chart } from "@/models/chart";
import { LocalCashe } from "@/helpers/local-cashe";
import {
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
} from "@/lib/gridstack";
import { useEffect } from "react";
import { GridChart } from "./grid-chart";

const LAYOUT_KEY = "chartGridLayout";

const options = {
  column: 5,
  minRow: 5,
  maxRow: 5,
  acceptWidgets: true,
  float: true,
  animate: true,
  alwaysShowResizeHandle: true,
  children: [
    {
      id: "chart3-testing-id",
      h: 2,
      w: 2,
      x: 0,
      y: 1,
      content: JSON.stringify({
        name: "GridChart",
        props: { chart: { id: "chart3-testing-id", name: "Chart 3", type: "bar" } },
      }),
    },
  ],
  //   LocalCashe.get<GridStackOptions["children"]>(LAYOUT_KEY) || [],
} as GridStackOptions;

const COMPONENT_MAP = {
  GridChart,
};

const SaveGridLayout = () => {
  const { saveOptions } = useGridStackContext();
  useEffect(() => {
    LocalCashe.set(LAYOUT_KEY, saveOptions());
  }, [saveOptions]);
  return null;
};

export function ChartGrid({ charts }: { charts: Chart[] }) {
  return (
    <GridStackProvider initialOptions={options}>
      <GridStackRenderProvider>
        <GridStackRender componentMap={COMPONENT_MAP} />
        <SaveGridLayout />
      </GridStackRenderProvider>
    </GridStackProvider>
  );
}
