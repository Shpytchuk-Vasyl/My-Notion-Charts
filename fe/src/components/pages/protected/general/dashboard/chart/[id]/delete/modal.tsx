import { useTranslations } from "next-intl";
import { DeleteChartForm } from "./form";
import { ChartService } from "@/services/chart";
import { deleteChart } from "@/app/[locale]/(protected)/(general)/dashboard/actions";

export function DeleteChartModal({
  params,
  isIntercepted = false,
}: {
  params: Promise<{ id: string }>;
  isIntercepted?: boolean;
}) {
  const chart = params.then(({ id }) => ChartService.getChartById(id));

  const t = useTranslations("pages.dashboard.charts.delete");
  return (
    <DeleteChartForm
      deleteChart={deleteChart}
      translation={{
        title: t("title"),
        description: t("description"),
        cancelButtonText: t("cancelButtonText"),
        deleteButtonText: t("deleteButtonText"),
        successMessage: t("successMessage"),
      }}
      isIntercepted={isIntercepted}
      chart={chart}
    />
  );
}
