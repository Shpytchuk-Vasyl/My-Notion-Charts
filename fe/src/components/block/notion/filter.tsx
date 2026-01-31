import { PropertyIcon } from "@/components/block/notion/property";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ChevronDown,
  Ellipsis,
  MoreVertical,
  LayersPlus,
} from "lucide-react";
import { type ChartConfigFilterType, type Chart } from "@/models/chart";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";
import { useBuilderContext } from "@/pages/protected/builder/context";
import { createContext, useContext } from "react";

const typeAndAllowedFilters = {
  checkbox: ["equals", "does_not_equal"],
  created_by: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
  created_time: [
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
  date: [
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
  email: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ],
  files: ["is_empty", "is_not_empty"],
  formula: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
    "greater_than",
    "greater_than_or_equal_to",
    "less_than",
    "less_than_or_equal_to",
    "after",
    "before",
    "on_or_after",
    "on_or_before",
    "next_week",
    "next_month",
    "next_year",
    "past_week",
    "past_month",
    "past_year",
    "this_week",
  ],
  last_edited_by: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
  last_edited_time: [
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
  multi_select: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
  number: [
    "equals",
    "does_not_equal",
    "greater_than",
    "greater_than_or_equal_to",
    "less_than",
    "less_than_or_equal_to",
    "is_empty",
    "is_not_empty",
  ],
  people: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
  phone_number: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ],
  place: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ],
  relation: ["contains", "does_not_contain", "is_empty", "is_not_empty"],
  rich_text: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ],
  rollup: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
    "greater_than",
    "greater_than_or_equal_to",
    "less_than",
    "less_than_or_equal_to",
    "after",
    "before",
    "on_or_after",
    "on_or_before",
    "next_week",
    "next_month",
    "next_year",
    "past_week",
    "past_month",
    "past_year",
    "this_week",
  ],
  select: ["equals", "does_not_equal", "is_empty", "is_not_empty"],
  status: ["equals", "does_not_equal", "is_empty", "is_not_empty"],
  title: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ],
  url: [
    "equals",
    "does_not_equal",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ],
} as const;

type AvailableOperators<T extends keyof typeof typeAndAllowedFilters> =
  (typeof typeAndAllowedFilters)[T][number];

type AvailableOperatorsKeys = AvailableOperators<
  keyof typeof typeAndAllowedFilters
>;

type WithPath<T> = T & { path: (string | number)[] };

type FilterFormProps = WithPath<{
  group: Chart["config"]["filters"];
}>;

type AndOrWrapperProps = {
  children: React.ReactNode;
};

type FilterRowOperatorSelectProps = {
  type?: string;
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
    <>
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
    </>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-fit mt-2">
        <MoreVertical />
        <span className="sr-only">більше</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => removeFilterGroup(path)}>
          Видалити групу
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterRow = () => {
  const { filter } = usePathContext();
  return (
    <div className="flex items-center gap-2">
      {/* And or Or */}
      <FilterRowAndOrSelect />

      {/* Property */}
      <FilterRowPropertySelect value={filter!.property} />

      {/* Operator */}
      <FilterRowOperatorSelect
        value={filter!.operator as AvailableOperatorsKeys}
        type={filter!.type}
      />

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

  if (index === 0) {
    return (
      <p className="w-20 max-w-20 grow shrink-0 px-3 py-2 text-sm whitespace-nowrap">
        Де
      </p>
    );
  }

  if (index > 1) {
    return (
      <p className="w-20 max-w-20 grow shrink-0 px-3 py-2 text-sm whitespace-nowrap">
        {groupKey}
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
          <SelectItem value="and">Та</SelectItem>
          <SelectItem value="or">АБО</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const FilterRowPropertySelect = ({ value }: FilterRowPropertySelectProps) => {
  const { availableFilterProperties, updateFilter } = useBuilderContext();
  const { path } = usePathContext();

  return (
    <Select
      value={value}
      onValueChange={(property) => {
        updateFilter(path, {
          property,
          type: availableFilterProperties.find(
            (prop) => prop.value === property,
          )?.type,
        });
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Властивість" />
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

const FilterRowOperatorSelect = ({
  type,
  value,
}: FilterRowOperatorSelectProps) => {
  const { path } = usePathContext();
  const { updateFilter } = useBuilderContext();

  return (
    <Select
      value={value}
      onValueChange={(operator) => {
        updateFilter(path, {
          operator,
        });
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Оператор" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {type &&
            (
              typeAndAllowedFilters[
                type as keyof typeof typeAndAllowedFilters
              ] || []
            ).map((key) => (
              <SelectItem
                key={`filter-operator-${path.join("-")}-${key}`}
                value={key}
              >
                {key}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

// temporary solution
const FilterRowValueInput = () => {
  const { updateFilter } = useBuilderContext();
  const { path, filter } = usePathContext();

  return (
    <Input
      placeholder="Значення"
      defaultValue={filter!.value as string}
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto">
        <MoreVertical />
        <span className="sr-only">більше</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => removeFilter(path)}>
          Видалити
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => addFilter(path.slice(0, -1), filter)}>
          Дублювати
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AddFilterMenuBar = ({ path }: AddFilterMenuBarProps) => {
  const { addFilter, addFilterGroup } = useBuilderContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus />
          Додати
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuItem onSelect={() => addFilter(path)}>
          <Plus />
          Умову
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => addFilterGroup(path)}>
          <LayersPlus />
          Групу умов
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
          let strs = [index === 0 ? "Де" : groupKey];
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

export const FilterRowToSrting = (filter: ChartConfigFilterType): string => {
  const { availableFilterProperties } = useBuilderContext();
  const property = availableFilterProperties.find(
    (prop) => prop.value === filter.property,
  );
  if (!property) return "";
  return [property.name, filter.operator ?? "", filter.value ?? ""].join(" ");
};
