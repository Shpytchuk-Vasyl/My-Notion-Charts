import { NewChartForm } from "@/pages/protected/dashboard/chart/new/form";
import { useTranslations } from "next-intl";
import { DefaultModal } from "@/components/ui/modal";
import { createChart } from "../../actions";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  const t = useTranslations("pages.dashboard.charts.new");

  return (
    <DefaultModal
      isIntercepted={false}
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
