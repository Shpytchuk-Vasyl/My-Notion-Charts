import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import RootSection from "./section";

const STEP_COLORS = ["blue", "purple", "green"] as const;

type StepProps = {
  number: number;
  color: (typeof STEP_COLORS)[number];
};

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
};

function Step({ number, color }: StepProps) {
  const t = useTranslations("pages.root.howItWorks");
  const stepIndex = number - 1;
  const title = t(`steps.${stepIndex}.title`);
  const description = t(`steps.${stepIndex}.description`);

  return (
    <li className="md:text-center px-4 list-none">
      <span
        className={`mb-6 flex h-16 w-16 items-center justify-center float-left mr-4 md:float-none md:mx-auto rounded-full text-2xl font-bold ${colorClasses[color]}`}
      >
        {number}
      </span>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <Card className="px-6 mt-4">
        <Image
          src={`/images/how-it-works-step-${number}.png`}
          alt={t("stepImageAlt", { number, title })}
          width={400}
          height={300}
        />
      </Card>
    </li>
  );
}

export function HowItWorksSection() {
  return (
    <RootSection>
      <div className="mx-auto max-w-6xl">
        {/* Desktop - Grid */}
        <ul className="hidden md:grid gap-12 md:grid-cols-3">
          {STEP_COLORS.map((color, index) => (
            <Step
              key={`how-it-works-step-${index + 1}`}
              number={index + 1}
              color={color}
            />
          ))}
        </ul>

        {/* Mobile - Carousel */}
        <Carousel className="w-full mx-auto md:hidden">
          <CarouselContent>
            {STEP_COLORS.map((color, index) => (
              <CarouselItem key={`carousel-step-${index + 1}`}>
                <Step number={index + 1} color={color} />
              </CarouselItem>
            ))}
            <CarouselPrevious />
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </RootSection>
  );
}
