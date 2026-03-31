import { AlertCircleIcon } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type Props = {
  error: string;
  className?: string;
};

export function ChartErrorView({ error, className }: Props) {
  const t = useTranslations("validation");
  return (
    <Card className={className}>
      <AlertCircleIcon className="place-self-center size-16" />
      <CardDescription className="text-pretty">
        {t(error) || error}
      </CardDescription>
    </Card>
  );
}
