import type { Tour } from "@/components/ui/tour";

export const TOUR_DASHBOARD_DRAG_CHART_ID = "drag-chart-to-dashboard";

export const TOUR_DASHBOARD_DRAG_CHART_STEP_IDS = {
  WELCOME: "grid-stack",
  SIDEBAR_CHARTS: "sidebar-charts",
  GRAB_CHART: "sidebar-chart-item",
  DROP_ZONE: "grid-stack",
  RESIZE_CHART: "grid-chart",
  MOVE_CHART: "grid-chart",
  COMPLETE: "grid-stack",
};

export const getTours: (t: (key: string) => string) => Tour[] = (t) => [
  {
    id: TOUR_DASHBOARD_DRAG_CHART_ID,
    steps: [
      {
        id: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.WELCOME,
        title: t("dragChart.welcome.title"),
        content: t("dragChart.welcome.content"),
        align: "start",
        side: "left",
        sideOffset: -300,
      },
      {
        id: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.SIDEBAR_CHARTS,
        title: t("dragChart.sidebarCharts.title"),
        content: t("dragChart.sidebarCharts.content"),
        side: "right",
        align: "start",
        sideOffset: 20,
      },
      {
        id: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.GRAB_CHART,
        title: t("dragChart.grabChart.title"),
        content: t("dragChart.grabChart.content"),
        side: "right",
        align: "center",
        sideOffset: 20,
      },
      {
        id: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.DROP_ZONE,
        title: t("dragChart.dropZone.title"),
        content: t("dragChart.dropZone.content"),
        align: "start",
        side: "left",
        sideOffset: -300,
      },
      {
        animated: "drag",
        fromSelector: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.GRAB_CHART,
        toSelector: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.DROP_ZONE,
        id: "",
        title: "",
        content: "",
      },
      {
        id: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.RESIZE_CHART,
        title: t("dragChart.resizeChart.title"),
        content: t("dragChart.resizeChart.content"),
        side: "left",
        align: "end",
        sideOffset: 20,
      },
      {
        id: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.MOVE_CHART,
        title: t("dragChart.moveChart.title"),
        content: t("dragChart.moveChart.content"),
        side: "top",
        align: "center",
        sideOffset: 20,
      },
      {
        id: TOUR_DASHBOARD_DRAG_CHART_STEP_IDS.COMPLETE,
        title: t("dragChart.complete.title"),
        content: t("dragChart.complete.content"),
        align: "start",
        side: "left",
        sideOffset: -300,
      },
    ],
  },
];
