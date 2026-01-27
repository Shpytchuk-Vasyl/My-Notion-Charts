"use client";
import "gridstack/dist/gridstack.min.css";
import { GridStack, type GridStackOptions } from "gridstack";
import { type Chart } from "@/models/chart";
import { LocalCashe } from "@/helpers/local-cashe";
import {
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
} from "@/lib/gridstack";
import { useEffect, useState } from "react";
import { GridChart } from "./grid-chart";
import { useTour } from "@/components/ui/tour";
import { TOUR_DASHBOARD_DRAG_CHART_ID } from "./tour";

const LAYOUT_KEY = "chartGridLayout";

const default_options = {
  column: 5,
  minRow: 5,
  maxRow: 5,
  acceptWidgets: true,
  float: true,
  animate: true,
  alwaysShowResizeHandle: true,
  children: [],
} as GridStackOptions;

const COMPONENT_MAP = {
  GridChart,
};

const SaveGridLayout = () => {
  const { saveOptions } = useGridStackContext();
  useEffect(() => {
    return () => LocalCashe.set(LAYOUT_KEY, saveOptions());
  }, []);

  return <div className="sr-only" />;
};

const SetupDragIn = () => {
  const { gridStack, _rawWidgetMetaMap } = useGridStackContext();

  useEffect(() => {
    if (!gridStack) return;
    GridStack.setupDragIn(".sidebar-draggable", {
      appendTo: "body",
      helper: "clone",
    });

    const handleDropped = (
      event: Event,
      previousWidget: any,
      newWidget: any,
    ) => {
      if (!newWidget?.el?.gridstackNode) return;

      const node = newWidget.el.gridstackNode;

      if (node.id && node.content) {
        _rawWidgetMetaMap.set((prev) => {
          const newMap = new Map(prev);
          newMap.set(node.id, node);
          return newMap;
        });
      }
    };

    gridStack.on("dropped", handleDropped);

    return () => {
      gridStack.off("dropped");
    };
  }, [gridStack, _rawWidgetMetaMap]);

  return null;
};

export function ChartGrid({ charts }: { charts: Chart[] }) {
  const { start } = useTour();

  function getGridOptiond() {
    const layout =
      LocalCashe.get<GridStackOptions>(LAYOUT_KEY) || default_options;
    layout.children = layout
      .children!.map((widget) => {
        const chart = charts.find((c) => c.id === widget.id);
        if (!chart) {
          return null;
        }

        return {
          ...widget,
          content: JSON.stringify({
            name: "GridChart",
            props: {
              chart: {
                id: chart.id,
                name: chart.name,
                type: chart.type,
              },
            },
          }),
        } as any;
      })
      .filter(Boolean);
    return layout;
  }

  const [options] = useState<GridStackOptions>(getGridOptiond);

  useEffect(() => {
    if (options.children!.length === 0 && charts.length === 1) {
      start(TOUR_DASHBOARD_DRAG_CHART_ID);
    }
  }, []);

  return (
    <GridStackProvider initialOptions={options}>
      <GridStackRenderProvider>
        <GridStackRender componentMap={COMPONENT_MAP} />
        <SaveGridLayout />
        <SetupDragIn />
      </GridStackRenderProvider>
    </GridStackProvider>
  );
}
