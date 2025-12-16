import { Database, Lock, Moon, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RootSection from "./section";

const FEATURE_CARD_ICONS = [Lock, Database, Smartphone, Moon] as const;
const FEATURE_CARD_COLORS = [
  "text-blue-600",
  "text-purple-600",
  "text-green-600",
  "text-gray-600",
] as const;

type FeatureCardProps = {
  cardIndex: number;
};

function FeatureCard({ cardIndex }: FeatureCardProps) {
  const t = useTranslations("pages.root.featureCards");
  const Icon = FEATURE_CARD_ICONS[cardIndex];
  const color = FEATURE_CARD_COLORS[cardIndex];

  return (
    <li className="list-none">
      <Card className="h-full">
        <CardHeader>
          <Icon className={`h-8 w-8 mb-2 ${color}`} />
          <CardTitle>{t(`cards.${cardIndex}.title`)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {t(`cards.${cardIndex}.description`)}
          </p>
        </CardContent>
      </Card>
    </li>
  );
}

export function FeatureCardsSection() {
  const t = useTranslations("pages.root.featureCards");

  return (
    <RootSection>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-4xl font-bold text-center">{t("title")}</h2>
        <p className="text-lg text-gray-600 text-center">{t("subtitle")}</p>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-16">
          {[0, 1, 2, 3].map((index) => (
            <FeatureCard key={`feature-card-${index}`} cardIndex={index} />
          ))}
        </ul>
      </div>
    </RootSection>
  );
}
