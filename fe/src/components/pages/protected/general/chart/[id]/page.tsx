import { useLocale } from "next-intl";

export function ChartPage({ id }: { id: string }) {
  const locale = useLocale();

  return (
    <iframe
      key={`grid-chart-view-${id}`}
      src={`/${locale}/chart/${id}/view`}
      className="aspect-video bg-card border m-4 p-6 rounded-xl shadow-sm max-h-[calc(100%-(--spacing(8)))]"
      frameBorder={0}
      allowFullScreen
    />
  );
}
