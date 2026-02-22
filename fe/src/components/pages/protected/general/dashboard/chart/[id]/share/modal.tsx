import { useTranslations } from "next-intl";
import { ChartService } from "@/services/chart";
import { ShareChartForm } from "./form";

export function ShareChartModal({
  params,
  isIntercepted = false,
}: {
  params: Promise<{ id: string }>;
  isIntercepted?: boolean;
}) {
  const chart = params.then(({ id }) =>
    ChartService.getChartById(id, "name,is_public"),
  );

  const t = useTranslations("pages.dashboard.charts.share");
  return (
    <ShareChartForm
      translation={{
        title: t("title"),
        description: t("description"),
        link: t("link"),
        linkCopied: t("linkCopied"),
        copy: t("copy"),
        share: t("share"),
        makePublicLabel: t("makePublicLabel"),
        makePublicDescription: t("makePublicDescription"),
        embed: t("embed"),
      }}
      isIntercepted={isIntercepted}
      chart={chart}
    />
  );
}
