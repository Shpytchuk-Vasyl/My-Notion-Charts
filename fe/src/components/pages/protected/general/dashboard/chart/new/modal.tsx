import { useTranslations } from "next-intl";
import { createChart } from "@/app/[locale]/(protected)/(general)/dashboard/actions";
import { DefaultModal } from "@/components/ui/modal";
import { NewChartForm } from "./form";

export { generateStaticParams } from "@/i18n/static-params";

export function CreateChartModal({
  isIntercepted = false,
}: {
  isIntercepted?: boolean;
}) {
  const t = useTranslations("pages.dashboard.charts.new");

  return (
    <DefaultModal
      isIntercepted={isIntercepted}
      title={t("title")}
      description={t("description")}
      cancel={t("cancel")}
      submit={t("create")}
      action={createChart}
      successMsg={t("successMessage")}
    >
      <NewChartForm />
    </DefaultModal>
  );
}
