import {
  CalendarIcon,
  ChevronDownIcon,
  CopyIcon,
  CopyXIcon,
  LayersPlusIcon,
  MoreVerticalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, Fragment, useContext } from "react";
import { PropertyIcon } from "@/components/block/notion/property";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Chart, ChartConfigFilterType } from "@/models/chart";
import { useBuilderContext } from "@/pages/protected/builder/context";

const typeAndAllowedFilters = {
  checkbox: {
    operators: ["equals", "does_not_equal"],
    inputType: "select",
    options: [
      {
        id: "true",
        name: "Checked",
      },
      {
        id: "false",
        name: "Unchecked",
      },
    ],
  },
  created_by: {
    operators: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
    inputType: "multi-select",
  },
  created_time: {
    operators: [
      "after",
      "before",
      "equals",
      "on_or_after",
      "on_or_before",
      "is_empty",
      "is_not_empty",
      "next_week",
      "next_month",
      "next_year",
      "past_week",
      "past_month",
      "past_year",
      "this_week",
    ],
    inputType: "date-select",
  },
  date: {
    operators: [
      "after",
      "before",
      "equals",
      "on_or_after",
      "on_or_before",
      "is_empty",
      "is_not_empty",
      "next_week",
      "next_month",
      "next_year",
      "past_week",
      "past_month",
      "past_year",
      "this_week",
    ],
    inputType: "date-select",
  },
  email: {
    operators: [
      "equals",
      "does_not_equal",
      "contains",
      "does_not_contain",
      "starts_with",
      "ends_with",
      "is_empty",
      "is_not_empty",
    ],
    inputType: "text",
  },
  files: { operators: ["is_empty", "is_not_empty"], inputType: "none" },
  formula: {
    // operators: [
    //   "equals",
    //   "does_not_equal",
    //   "contains",
    //   "does_not_contain",
    //   "starts_with",
    //   "ends_with",
    //   "is_empty",
    //   "is_not_empty",
    //   "greater_than",
    //   "greater_than_or_equal_to",
    //   "less_than",
    //   "less_than_or_equal_to",
    //   "after",
    //   "before",
    //   "on_or_after",
    //   "on_or_before",
    //   "next_week",
    //   "next_month",
    //   "next_year",
    //   "past_week",
    //   "past_month",
    //   "past_year",
    //   "this_week",
    // ],
    // inputType: "formula",
    // it is temporary solution, because formula can return different types and they not spesified in notion response
    operators: ["is_empty", "is_not_empty"],
    inputType: "none",
  },
  last_edited_by: {
    operators: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
    inputType: "multi-select",
  },
  last_edited_time: {
    operators: [
      "after",
      "before",
      "equals",
      "on_or_after",
      "on_or_before",
      "is_empty",
      "is_not_empty",
      "next_week",
      "next_month",
      "next_year",
      "past_week",
      "past_month",
      "past_year",
      "this_week",
    ],
    inputType: "date-select",
  },
  multi_select: {
    operators: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
    inputType: "multi-select",
  },
  number: {
    operators: [
      "equals",
      "does_not_equal",
      "greater_than",
      "greater_than_or_equal_to",
      "less_than",
      "less_than_or_equal_to",
      "is_empty",
      "is_not_empty",
    ],
    inputType: "number",
  },
  unique_id: {
    operators: [
      "equals",
      "does_not_equal",
      "greater_than",
      "greater_than_or_equal_to",
      "less_than",
      "less_than_or_equal_to",
      "is_empty",
      "is_not_empty",
    ],
    inputType: "number",
  },
  people: {
    operators: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
    inputType: "multi-select",
  },
  phone_number: {
    operators: [
      "equals",
      "does_not_equal",
      "contains",
      "does_not_contain",
      "starts_with",
      "ends_with",
      "is_empty",
      "is_not_empty",
    ],
    inputType: "text",
  },
  place: {
    operators: ["is_empty", "is_not_empty"],
    inputType: "none",
  },
  relation: {
    operators: ["is_empty", "is_not_empty"],
    inputType: "none",
  },
  rich_text: {
    operators: [
      "equals",
      "does_not_equal",
      "contains",
      "does_not_contain",
      "starts_with",
      "ends_with",
      "is_empty",
      "is_not_empty",
    ],
    inputType: "text",
  },
  rollup: {
    // operators: [
    //   "equals",
    //   "does_not_equal",
    //   "contains",
    //   "does_not_contain",
    //   "starts_with",
    //   "ends_with",
    //   "is_empty",
    //   "is_not_empty",
    //   "greater_than",
    //   "greater_than_or_equal_to",
    //   "less_than",
    //   "less_than_or_equal_to",
    //   "after",
    //   "before",
    //   "on_or_after",
    //   "on_or_before",
    //   "next_week",
    //   "next_month",
    //   "next_year",
    //   "past_week",
    //   "past_month",
    //   "past_year",
    //   "this_week",
    // ],
    // inputType: "formula",
    // it is temporary solution, because rollup can return different types and they not spesified in notion response
    operators: ["is_empty", "is_not_empty"],
    inputType: "none",
  },
  select: {
    operators: ["equals", "does_not_equal", "is_empty", "is_not_empty"],
    inputType: "select",
  },
  status: {
    operators: ["equals", "does_not_equal", "is_empty", "is_not_empty"],
    inputType: "multi-select",
  },
  title: {
    operators: [
      "equals",
      "does_not_equal",
      "contains",
      "does_not_contain",
      "starts_with",
      "ends_with",
      "is_empty",
      "is_not_empty",
    ],
    inputType: "text",
  },
  url: {
    operators: [
      "equals",
      "does_not_equal",
      "contains",
      "does_not_contain",
      "starts_with",
      "ends_with",
      "is_empty",
      "is_not_empty",
    ],
    inputType: "text",
  },
} as const;

const shouldResetValueOperators = [
  "is_empty",
  "is_not_empty",
  "next_week",
  "next_month",
  "next_year",
  "past_week",
  "past_month",
  "past_year",
  "this_week",
];

type AvailableTypes = keyof typeof typeAndAllowedFilters;

type AvailableOperators<T extends AvailableTypes> =
  (typeof typeAndAllowedFilters)[T]["operators"][number];

type AvailableOperatorsKeys = AvailableOperators<AvailableTypes>;

type AvailableInputTypes<T extends AvailableTypes> =
  (typeof typeAndAllowedFilters)[T]["inputType"];

type AvailableInputTypesKeys = AvailableInputTypes<AvailableTypes>;

type WithPath<T> = T & { path: (string | number)[] };

type FilterFormProps = WithPath<{
  group: Chart["config"]["filters"];
}>;

type AndOrWrapperProps = {
  children: React.ReactNode;
};

type FilterRowOperatorSelectProps = {
  type: AvailableTypes;
  value?: AvailableOperatorsKeys;
};

type FilterRowPropertySelectProps = {
  value?: string;
};

type AddFilterMenuBarProps = WithPath<{}>;

type PathContextType = {
  path: (string | number)[];
  index: number;
  groupKey: string;
  filter?: ChartConfigFilterType;
};

const PathContext = createContext<PathContextType | null>(null);
const PathProvider = PathContext.Provider;
const usePathContext = (): PathContextType => useContext(PathContext)!;

export const FilterForm = ({ group, path: outerPath }: FilterFormProps) => {
  return Object.entries(group).map(([groupKey, filtersAndGroups]) => (
    <Fragment
      key={`filter-group-wrapper-${[...outerPath, groupKey].join("-")}`}
    >
      {filtersAndGroups.map((filterOrGroup, index) => {
        const path = [...outerPath, groupKey, index];

        if ("and" in filterOrGroup || "or" in filterOrGroup) {
          return (
            <PathProvider
              key={`filter-group-${path.join("-")}`}
              value={{ path, index, groupKey }}
            >
              <AndOrWrapper>
                <FilterForm group={filterOrGroup} path={path} />
              </AndOrWrapper>
            </PathProvider>
          );
        }

        return (
          <PathProvider
            key={`filter-row-${path.join("-")}`}
            value={{
              path,
              index,
              groupKey,
              filter: filterOrGroup as ChartConfigFilterType,
            }}
          >
            <FilterRow />
          </PathProvider>
        );
      })}
      <AddFilterMenuBar path={[...outerPath, groupKey]} />
    </Fragment>
  ));
};

const AndOrWrapper = ({ children }: AndOrWrapperProps) => {
  return (
    <section className="flex gap-2">
      <FilterRowAndOrSelect />
      <Card className="p-4 gap-2 grow">{children}</Card>
      <AndOrWrapperDropdownMenu />
    </section>
  );
};

const AndOrWrapperDropdownMenu = () => {
  const { removeFilterGroup } = useBuilderContext();
  const { path } = usePathContext();
  const t = useTranslations("pages.chart.edit.nav.filters");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-fit mt-2">
        <MoreVerticalIcon />
        <span className="sr-only">{t("more")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => removeFilterGroup(path)}
        >
          <CopyXIcon className="text-destructive" />
          {t("deleteGroup")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterRow = () => {
  return (
    <div className="flex items-center gap-2">
      {/* And or Or */}
      <FilterRowAndOrSelect />

      {/* Property */}
      <FilterRowPropertySelect />

      {/* Operator */}
      <FilterRowOperatorSelect />

      {/* Value */}
      <FilterRowValueInput />

      {/* Dropdown Menu */}
      <FilterRowDropDownMenu />
    </div>
  );
};

const FilterRowAndOrSelect = () => {
  const { index, groupKey, path } = usePathContext();
  const { updateFilterGroup } = useBuilderContext();
  const t = useTranslations("pages.chart.edit.nav.filters");

  if (index === 0) {
    return (
      <p className="w-20 max-w-20 grow shrink-0 px-3 py-2 text-sm whitespace-nowrap">
        {t("where")}
      </p>
    );
  }

  if (index > 1) {
    return (
      <p className="w-20 max-w-20 grow shrink-0 px-3 py-2 text-sm whitespace-nowrap">
        {groupKey === "and" ? t("and") : t("or")}
      </p>
    );
  }

  return (
    <Select
      value={groupKey}
      onValueChange={(newValue) =>
        updateFilterGroup(path.slice(0, -2), newValue)
      }
    >
      <SelectTrigger className="w-20 max-w-20 grow shrink-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="and">{t("and")}</SelectItem>
          <SelectItem value="or">{t("or")}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const FilterRowPropertySelect = () => {
  const { availableFilterProperties, updateFilter } = useBuilderContext();
  const { path, filter } = usePathContext();
  const t = useTranslations("pages.chart.edit.nav");

  return (
    <Select
      value={filter!.property}
      onValueChange={(property) => {
        updateFilter(path, {
          property,
          type: availableFilterProperties.find(
            (prop) => prop.value === property,
          )?.type,
          operator: undefined,
          value: undefined,
        });
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={t("property")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableFilterProperties.map(({ name, value, type }) => (
            <SelectItem
              key={`filter-property-${path.join("-")}-${value}`}
              value={value}
            >
              <PropertyIcon type={type as any} />
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const FilterRowOperatorSelect = () => {
  const { path, filter } = usePathContext();
  const { updateFilter } = useBuilderContext();
  const t = useTranslations("pages.chart.edit.nav.filters");

  const value = filter!.operator as AvailableOperatorsKeys;
  const type = filter!.type as AvailableTypes;

  const operators = typeAndAllowedFilters[type]?.operators || [];

  return (
    <Select
      value={value}
      onValueChange={(operator) => {
        updateFilter(path, {
          operator,
          ...(shouldResetValueOperators.includes(operator)
            ? { value: undefined }
            : {}),
        });
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={t("operator")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {operators.map((key) => (
            <SelectItem
              key={`filter-operator-${path.join("-")}-${key}`}
              value={key}
            >
              {t(`operators.${key}`)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

// temporary solution
const FilterRowValueInput = () => {
  const { updateFilter, availableFilterProperties } = useBuilderContext();
  const { path, filter } = usePathContext();
  const t = useTranslations("pages.chart.edit.nav.filters");

  const selectedProperty = availableFilterProperties.find(
    (prop) => prop.value === filter!.property,
  ) as any;

  if (!selectedProperty) {
    return null;
  }

  const inputType =
    typeAndAllowedFilters[selectedProperty.type as AvailableTypes].inputType;

  if (
    !inputType ||
    inputType === "none" ||
    shouldResetValueOperators.includes(filter!.operator!)
  ) {
    return null;
  }

  if (inputType === "select") {
    const options =
      selectedProperty[selectedProperty.type].options ||
      (typeAndAllowedFilters as any)[selectedProperty.type].options ||
      [];

    return (
      <Select
        value={filter!.value as string}
        onValueChange={(value) =>
          updateFilter(path, {
            value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={t("value")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(({ id, name }: any) => (
              <SelectItem
                key={`filter-value-select-${path.join("-")}-${id}`}
                value={id}
              >
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  if (inputType === "multi-select") {
    return (
      <MultiSelect
        values={filter!.value as string[]}
        onValuesChange={(value) =>
          updateFilter(path, {
            value,
          })
        }
      >
        <MultiSelectTrigger>
          <MultiSelectValue placeholder={t("value")} />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectGroup>
            {selectedProperty[selectedProperty.type].options.map(
              ({ id, name }: any) => (
                <MultiSelectItem
                  key={`filter-value-select-${path.join("-")}-${id}`}
                  value={id}
                >
                  {name}
                </MultiSelectItem>
              ),
            )}
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
    );
  }

  if (inputType === "date-select") {
    const date = filter!.value ? new Date(filter!.value as string) : undefined;
    const setDate = (date: Date | undefined) => {
      updateFilter(path, {
        value: date ? date.toISOString() : undefined,
      });
    };
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon />
            {date ? date.toLocaleDateString() : <span>{t("pickDate")}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Input
      placeholder={t("value")}
      defaultValue={filter!.value as string}
      type={inputType}
      onBlur={(e) =>
        updateFilter(path, {
          value: e.target.value,
        })
      }
    />
  );
};

const FilterRowDropDownMenu = () => {
  const { removeFilter, addFilter } = useBuilderContext();
  const { path, filter } = usePathContext();
  const t = useTranslations("pages.chart.edit.nav.filters");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto">
        <MoreVerticalIcon />
        <span className="sr-only">{t("more")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-destructive"
          onSelect={() => removeFilter(path)}
        >
          <Trash2Icon className="text-destructive" />
          {t("delete")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => addFilter(path.slice(0, -1), filter)}>
          <CopyIcon />
          {t("duplicate")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AddFilterMenuBar = ({ path }: AddFilterMenuBarProps) => {
  const { addFilter, addFilterGroup } = useBuilderContext();
  const t = useTranslations("pages.chart.edit.nav.filters");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <PlusIcon />
          {t("add")}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuItem onSelect={() => addFilter(path)}>
          <PlusIcon />
          {t("addCondition")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => addFilterGroup(path)}>
          <LayersPlusIcon />
          {t("addConditionGroup")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const FilterFormToString = (
  group: Chart["config"]["filters"],
): string => {
  return Object.entries(group)
    .map(([groupKey, filtersAndGroups]) =>
      filtersAndGroups
        .map((filterOrGroup, index) => {
          const strs = [index === 0 ? "Де" : groupKey];
          if ("and" in filterOrGroup || "or" in filterOrGroup) {
            strs.push("(");
            strs.push(
              FilterFormToString(filterOrGroup as Chart["config"]["filters"]),
            );
            strs.push(")");
          } else {
            strs.push(
              FilterRowToSrting(filterOrGroup as ChartConfigFilterType),
            );
          }
          return strs.join(" ");
        })
        .join(" "),
    )
    .join(" ");
};

const FilterRowToSrting = (filter: ChartConfigFilterType): string => {
  const { availableFilterProperties } = useBuilderContext();
  const property = availableFilterProperties.find(
    (prop) => prop.value === filter.property,
  ) as any;
  if (!property) return "";

  const inputType =
    typeAndAllowedFilters[property.type as AvailableTypes].inputType;

  let value;

  if (inputType === "select") {
    const option = (
      property[property.type].options ||
      (typeAndAllowedFilters as any)[property.type].options ||
      []
    ).find((opt: any) => opt.id === filter.value);
    value = option ? option.name : "";
  } else if (inputType === "multi-select") {
    const options = property[property.type].options.filter((opt: any) =>
      ((filter.value || []) as string[]).includes(opt.id),
    );
    value = (options.map((opt: any) => opt.name) as string[]).join(", ");
  } else if (inputType === "date-select") {
    value = filter.value
      ? new Date(filter.value as string).toLocaleDateString()
      : "";
  } else {
    value = filter.value;
  }

  return [property.name, filter.operator ?? "", value ?? ""].join(" ");
};
