import { Card, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type Props = {
  error: string;
  className?: string;
};

export function ViewError({ error, className }: Props) {
  return (
    <Card className={className}>
      <AlertCircle className="place-self-center size-16" />
      <CardDescription className="text-pretty">{error}</CardDescription>
    </Card>
  );
}
