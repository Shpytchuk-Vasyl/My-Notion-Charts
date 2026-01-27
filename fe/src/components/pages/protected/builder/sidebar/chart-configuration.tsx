"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ChartConfig = {
//   joins?: {
//     from_id: string;
//     to_id: string;
//     table_id: string;
//   }[];
//   filters?: {
//     [key in "and" | "or"]?: {
//       operator: AvailableOperators;
//       property: string;
//       value: string;
//     }[];
//   };
//   sort?: {
//     property: string;
//     ascending: boolean;
//   };
//   limit?: number;
//   axis?: {
//     [key in "x" | "y"]: {
//       property: string;
//       aggregation: "none" | "count" | "sum" | "average" | "min" | "max";
//     }[];
//   };
//   cache?: {
//     duration: number;
//   };
// };

export function ChartConfigurationAccordion() {
  return (
    <Accordion type="multiple" defaultValue={["chart-configuration"]}>
      <SettingsAccordionItem />

      <AxisAccordionItem />

      <CacheAccordionItem />

      <JoinsAccordionItem />

      <FiltersAccordionItem />

      <SortAccordionItem />

      <LimitAccordionItem />
    </Accordion>
  );
}

const SettingsAccordionItem = () => {
  return (
    <AccordionItem value="chart-configuration">
      <AccordionTrigger>Налаштування</AccordionTrigger>
      <AccordionContent>Налаштування графіка</AccordionContent>
    </AccordionItem>
  );
};

const JoinsAccordionItem = () => {
  return (
    <AccordionItem value="chart-joins">
      <AccordionTrigger>З'єднання</AccordionTrigger>
      <AccordionContent>З'єднання між таблицями</AccordionContent>
    </AccordionItem>
  );
};

const FiltersAccordionItem = () => {
  return (
    <AccordionItem value="chart-filters">
      <AccordionTrigger>Фільтри</AccordionTrigger>
      <AccordionContent>Фільтри даних графіка</AccordionContent>
    </AccordionItem>
  );
};

const SortAccordionItem = () => {
  return (
    <AccordionItem value="chart-sort">
      <AccordionTrigger>Сортування</AccordionTrigger>
      <AccordionContent>Сортування даних графіка</AccordionContent>
    </AccordionItem>
  );
};

const LimitAccordionItem = () => {
  return (
    <AccordionItem value="chart-limit">
      <AccordionTrigger>Ліміт</AccordionTrigger>
      <AccordionContent>Ліміт кількості точок даних графіка</AccordionContent>
    </AccordionItem>
  );
};

const AxisAccordionItem = () => {
  return (
    <AccordionItem value="chart-axis">
      <AccordionTrigger>Вісь</AccordionTrigger>
      <AccordionContent>Налаштування осей графіка</AccordionContent>
    </AccordionItem>
  );
};

const CacheAccordionItem = () => {
  return (
    <AccordionItem value="chart-cache">
      <AccordionTrigger>Кешування</AccordionTrigger>
      <AccordionContent>Налаштування кешування даних графіка</AccordionContent>
    </AccordionItem>
  );
};
