import { AlertCircleIcon } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";

type Props = {
  error: string;
  className?: string;
};

export function ChartErrorView({ error, className }: Props) {
  return (
    <Card className={className}>
      <AlertCircleIcon className="place-self-center size-16" />
      <CardDescription className="text-pretty">{error}</CardDescription>
    </Card>
  );
}
