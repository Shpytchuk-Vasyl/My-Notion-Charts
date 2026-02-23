"use client";

import "gridstack/dist/gridstack.min.css";
import { GridStack, type GridStackOptions } from "gridstack";
import { useEffect, useState } from "react";
import { useTour } from "@/components/ui/tour";
import { debounce } from "@/helpers/debounce";
import { LocalCashe } from "@/helpers/local-cashe";
import {
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
} from "@/lib/gridstack";
import type { Chart } from "@/models/chart";
import { TOUR_DASHBOARD_DRAG_CHART_ID } from "./../tour";
import { GridChart } from "./chart";

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

const SetupDragIn = () => {
  const { gridStack, _rawWidgetMetaMap, saveOptions } = useGridStackContext();

  useEffect(() => {
    if (!gridStack) return;
    GridStack.setupDragIn(".sidebar-draggable", {
      appendTo: "body",
      helper: "clone",
    });

    const save = debounce(() => {
      const t = saveOptions();
      LocalCashe.set(LAYOUT_KEY, t);
    }, 4000);

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
      save();
    };

    const handDragStart = () => {
      Array.from(document.getElementsByClassName("grid-chart-view")).forEach(
        (iframe) => {
          iframe.classList.add("pointer-events-none");
        },
      );
    };

    const handleDragStop = () => {
      Array.from(document.getElementsByClassName("grid-chart-view")).forEach(
        (iframe) => {
          iframe.classList.remove("pointer-events-none");
        },
      );
      save();
    };

    gridStack.on("resizestart", handDragStart);
    gridStack.on("resizestop", handleDragStop);
    gridStack.on("dragstop", handleDragStop);
    gridStack.on("dragstart", handDragStart);
    gridStack.on("dropped", handleDropped);

    return () => {
      gridStack.off("resizestart");
      gridStack.off("resizestop");
      gridStack.off("dropped");
      gridStack.off("dragstart");
      gridStack.off("dragstop");
    };
  }, [gridStack, _rawWidgetMetaMap]);

  return null;
};

export function ChartGrid({
  charts,
  children,
}: React.PropsWithChildren<{ charts: Omit<Chart, "config">[] }>) {
  const { start } = useTour();

  function getGridOptions() {
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

  const [options] = useState<GridStackOptions>(getGridOptions);

  useEffect(() => {
    if (options.children!.length === 0 && charts.length === 1) {
      start(TOUR_DASHBOARD_DRAG_CHART_ID);
    }
  }, []);

  return (
    <GridStackProvider initialOptions={options}>
      <GridStackRenderProvider>
        <GridStackRender componentMap={COMPONENT_MAP} />
        <SetupDragIn />
        {children}
      </GridStackRenderProvider>
    </GridStackProvider>
  );
}
