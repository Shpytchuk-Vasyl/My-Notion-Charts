import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FiltersAccordionItem = () => {
  return (
    <AccordionItem value="chart-filters">
      <AccordionTrigger>Фільтри</AccordionTrigger>
      <AccordionContent>Фільтри даних графіка</AccordionContent>
    </AccordionItem>
  );
};
