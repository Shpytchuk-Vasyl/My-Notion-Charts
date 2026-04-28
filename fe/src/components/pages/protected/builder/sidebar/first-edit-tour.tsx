"use client";

import { useEffect, useState } from "react";
import { useBuilderContext } from "../context";
import { useProtectedContext } from "../../context";
import { useTour } from "@/components/ui/tour";
import { TOUR_FIRST_EDIT_CHART_ID } from "../tour";

export const FirstEditChartTour = () => {
  const [count, setCount] = useState<number | null>(null);
  const { isLoading } = useBuilderContext();
  const { charts } = useProtectedContext();
  const { start } = useTour();

  useEffect(() => {
    charts.then((charts) => {
      setCount(charts.length);
    });
  }, [charts]);

  useEffect(() => {
    if (count !== null && count === 1 && !isLoading) {
      // if (count !== null && !isLoading) { // for testing purposes
      start(TOUR_FIRST_EDIT_CHART_ID);
    }
  }, [count, isLoading]);

  return null;
};
