"use client";

import { useParams } from "next/navigation";
import { DefaultModal } from "@/components/ui/modal";
import { SuspenseSkeleton } from "@/components/ui/skeleton-suspense";
import type { Chart } from "@/models/chart";

type DeleteChartFormProps = {
  deleteChart: (id: string) => Promise<{
    success: boolean;
    msg: string;
  }>;
  translation: {
    title: string;
    description: string;
    cancelButtonText: string;
    deleteButtonText: string;
    successMessage: string;
  };
  isIntercepted?: boolean;
  chart: Promise<Pick<Chart, "name">>;
};

export function DeleteChartForm({
  deleteChart,
  translation,
  isIntercepted = false,
  chart,
}: DeleteChartFormProps) {
  const { id } = useParams();
  const handleDelete = () => {
    return deleteChart(id as string);
  };

  return (
    <DefaultModal
      title={
        <>
          {translation.title}: {<Name chart={chart} />}
        </>
      }
      description={translation.description}
      cancel={translation.cancelButtonText}
      submit={translation.deleteButtonText}
      action={handleDelete}
      successMsg={translation.successMessage}
      isIntercepted={isIntercepted}
    />
  );
}

const Name = ({ chart }: Pick<DeleteChartFormProps, "chart">) => {
  return (
    <SuspenseSkeleton
      promise={chart}
      className="w-40 h-full inline-block"
      afterKey="name"
    />
  );
};
