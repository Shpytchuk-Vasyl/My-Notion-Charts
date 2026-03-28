import {
  ArrowRightIcon,
  BarChart3Icon,
  DatabaseIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  LockIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import RootSection from "./section";

const FEATURE_ICONS = [
  [ZapIcon, LockIcon, FileSpreadsheetIcon],
  [BarChart3Icon, DatabaseIcon, FileSpreadsheetIcon],
  [ArrowRightIcon, ArrowRightIcon, DownloadIcon],
] as const;

const FEATURE_COLORS = ["green", "purple", "blue"] as const;

type FeatureItemProps = {
  icon: typeof ZapIcon;
  text: string;
  color: (typeof FEATURE_COLORS)[number];
};

const colorClasses = {
  green: "text-green-600",
  purple: "text-purple-600",
  blue: "text-blue-600",
};

function FeatureItem({ icon: Icon, text, color }: FeatureItemProps) {
  return (
    <li className="flex items-start gap-3">
      <Icon className={`h-5 w-5 mt-1 ${colorClasses[color]}`} />
      <span>{text}</span>
    </li>
  );
}

type FeatureBlockProps = {
  blockIndex: number;
  toRight: boolean;
};

function FeatureBlock({ blockIndex, toRight }: FeatureBlockProps) {
  const t = useTranslations("pages.root.features");

  const title = t(`blocks.${blockIndex}.title`);
  const description = t(`blocks.${blockIndex}.description`);
  const items = [0, 1, 2].map((itemIndex) => ({
    icon: FEATURE_ICONS[blockIndex][itemIndex],
    text: t(`blocks.${blockIndex}.items.${itemIndex}`),
    color: FEATURE_COLORS[blockIndex],
  }));

  return (
    <div className="mb-20 md:grid gap-12 md:grid-cols-2 flex flex-col-reverse">
      <Card className="px-6">
        <Image
          src={`/images/feature-${title.toLowerCase().replace(/ /g, "-")}.png`}
          alt={t("featureImageAlt", { title })}
          width={600}
          height={400}
        />
      </Card>
      <div className={toRight ? "md:order-first" : ""}>
        <h2 className="mb-4 text-4xl font-bold">{title}</h2>
        <p className="mb-6 text-lg text-gray-600">{description}</p>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <FeatureItem
              key={`feature-item-${blockIndex}-${index}`}
              {...item}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FeaturesGridSection() {
  return (
    <RootSection>
      <div className="mx-auto max-w-6xl">
        {[0, 1, 2].map((index) => (
          <FeatureBlock
            key={`feature-block-${index}`}
            blockIndex={index}
            toRight={index % 2 === 1}
          />
        ))}
      </div>
    </RootSection>
  );
}
