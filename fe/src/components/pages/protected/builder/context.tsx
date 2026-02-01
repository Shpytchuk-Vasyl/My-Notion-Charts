"use client";

import { type Chart, type ChartConfigFilterType } from "@/models/chart";
import { createContext, useContext, useEffect, useState } from "react";
import { useDashboardContext } from "@/pages/protected/general/dashboard/context";
import { useParams } from "next/navigation";
import { type PartialDataSourceObjectResponse } from "@notionhq/client";
import { chartThemeNames } from "@/components/block/chart/themes";
import path from "path";

type SortProperty = {
  name: string;
  value: string;
  type: string;
};

type AvailableJoinType = {
  id: string;
  name: string;
  from: SortProperty[];
  to: SortProperty[];
};

type PathType = (string | number)[];

interface BuilderContextType {
  isLoading: boolean;
  cacheDuration: number | undefined;
  setCacheDuration: (duration: number) => void;
  limit: number | undefined;
  setLimit: (newLimit: number | undefined) => void;
  availableSortProperties: SortProperty[];
  sortProperty: string | undefined;
  sortAscending: boolean | undefined;
  setSortProperty: (value: string) => void;
  toggleSortAscending: (ascending: boolean) => void;
  joins: Chart["config"]["joins"];
  availableJoins: AvailableJoinType[];
  onChangeJoin: (index: number, fromId?: string, toId?: string) => void;
  name: string | undefined;
  setName: (newName: string) => void;
  type: Chart["type"] | undefined;
  setType: (newType: string) => void;
  theme: string | undefined;
  setTheme: (newTheme: string) => void;
  availableThemes: SortProperty[];
  axisX: string | undefined;
  setAxisX: (property: string) => void;
  axisY: Chart["config"]["axis"]["y"];
  setAxisY: (index: number, property: string, aggregation?: string) => void;
  addAxisY: () => void;
  removeAxisY: (index: number) => void;
  availableAxisProperties: SortProperty[];
  filters: Chart["config"]["filters"] | undefined;
  availableFilterProperties: (PartialDataSourceObjectResponse["properties"]["key"] &
    SortProperty)[];
  addFilter: (
    path: PathType,
    newFilter?: Partial<ChartConfigFilterType>,
  ) => void;
  updateFilter: (path: PathType, props: Partial<ChartConfigFilterType>) => void;
  removeFilter: (path: PathType) => void;
  addFilterGroup: (path: PathType) => void;
  updateFilterGroup: (
    path: PathType,
    newKey: "and" | "or" | (string & {}),
  ) => void;
  removeFilterGroup: (path: PathType) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({
  children,
  databasesPromise,
}: React.PropsWithChildren<{
  databasesPromise: Promise<PartialDataSourceObjectResponse[]>;
}>) {
  const { id } = useParams();
  const { charts } = useDashboardContext();
  const [chart, set] = useState<Chart | null>(null);
  const [databases, setDatabases] = useState<PartialDataSourceObjectResponse[]>(
    [],
  );

  //
  // data loading
  //
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      const [awaitedCharts, awaitedDatabases] = await Promise.all([
        charts,
        databasesPromise,
      ]);
      const currentChart = awaitedCharts.find((c) => c.id === id) ?? null;
      set(currentChart);
      setDatabases(
        currentChart
          ? awaitedDatabases.filter((db) =>
              currentChart.databases.includes(db.id),
            )
          : [],
      );
      setIsLoading(false);
    }
    loadData();
  }, [charts, databasesPromise, id]);

  //
  // setChart wrapper
  //
  const setChart: React.Dispatch<React.SetStateAction<Chart>> = (updater) => {
    if (typeof updater === "function") {
      set((prev) => {
        const updated = (updater as (prevState: Chart | null) => Chart | null)(
          JSON.parse(JSON.stringify(prev)),
        );
        return updated;
      });
    } else set(updater);
  };

  //
  // cashe management
  //
  const cacheDuration = chart?.config?.cache?.duration;
  const setCacheDuration = (duration: number) => {
    setChart((prev) => {
      prev.config.cache.duration = duration;
      return prev;
    });
  };

  //
  // limit management
  //
  const limit = chart?.config?.limit;
  const setLimit = (newLimit: number | undefined) => {
    setChart((prev) => {
      prev.config.limit = newLimit;
      return prev;
    });
  };

  //
  // sort management
  //
  const availableSortProperties = databases.flatMap((db) =>
    Object.entries(db.properties).map(([key, prop]) => ({
      name: prop.name,
      value: `${db.id}::${prop.id}`,
      type: prop.type,
    })),
  );
  const sortProperty = chart?.config?.sort?.property;
  const sortAscending = chart?.config?.sort?.ascending;
  const setSortProperty = (value: string) => {
    setChart((prev) => {
      if (!prev.config.sort && value !== "none") {
        prev.config.sort = { property: value, ascending: true };
      } else if (value === "none") {
        delete prev.config.sort;
      } else {
        prev.config.sort!.property = value;
      }
      return prev;
    });
  };
  const toggleSortAscending = (ascending: boolean) => {
    setChart((prev) => {
      prev.config.sort!.ascending = ascending;
      return prev;
    });
  };

  //
  // join management
  //
  const joins = chart?.config?.joins ?? [];
  const availableJoins = databases
    .map((db) => ({
      ...db,
      properties: Object.values(db.properties).map((prop) => ({
        ...prop,
        value: `${db.id}::${prop.id}`,
      })) as AvailableJoinType["from"],
    }))
    .map((db, idx, arr) => {
      const nextDb = arr[idx + 1];
      const prevDb = arr[idx - 1];

      return {
        id: nextDb?.id ?? "",
        name: (nextDb as any)?.title?.[0]?.plain_text,
        from: db.properties.concat(prevDb?.properties ?? []),
        to: nextDb?.properties ?? [],
      };
    })
    .slice(0, -1);
  const onChangeJoin = (index: number, fromId?: string, toId?: string) => {
    setChart((prev) => {
      const joins = prev.config.joins;
      if (fromId) joins[index].from = fromId;
      if (toId) joins[index].to = toId;
      prev.config.joins = joins;
      return prev;
    });
  };

  //
  // base chart settings management
  //
  const name = chart?.name;
  const setName = (newName: string) => {
    setChart((prev) => {
      prev.name = newName;
      return prev;
    });
  };
  const type = chart?.type;
  const setType = (newType: string) => {
    setChart((prev) => {
      prev.type = newType as Chart["type"];
      return prev;
    });
  };
  const theme = chart?.config?.customization.theme;
  const setTheme = (newTheme: string) => {
    setChart((prev) => {
      prev.config.customization.theme = newTheme;
      return prev;
    });
  };
  const availableThemes = chartThemeNames.map((theme) => ({
    name: theme,
    value: theme,
  })) as SortProperty[];

  //
  // axis management
  //
  const availableAxisProperties = availableSortProperties;
  const axisX = chart?.config?.axis?.x?.property;
  const axisY = chart?.config?.axis?.y ?? [];
  const setAxisX = (property: string) => {
    setChart((prev) => {
      prev.config.axis.x.property = property;
      return prev;
    });
  };
  const setAxisY = (index: number, property: string, aggregation?: string) => {
    setChart((prev) => {
      prev.config.axis.y[index] = {
        property,
        aggregation:
          aggregation as Chart["config"]["axis"]["y"][number]["aggregation"],
      };
      return prev;
    });
  };
  const addAxisY = () => {
    setChart((prev) => {
      prev.config.axis.y.push({ property: "" });
      return prev;
    });
  };
  const removeAxisY = (index: number) => {
    setChart((prev) => {
      prev.config.axis.y.splice(index, 1);
      return prev;
    });
  };

  //
  // Filter management
  //
  const filters = chart?.config?.filters;
  const availableFilterProperties = databases.flatMap((db) =>
    Object.values(db.properties).map((prop) => ({
      ...prop,
      value: `${db.id}::${prop.id}`,
    })),
  );
  const getNodeAtPath = (node: any, path: PathType, length: number) => {
    for (let i = 0; i < length; i++) {
      node = node[path[i]];
    }
    return node;
  };
  const addFilter = (
    path: PathType,
    newFilter: Partial<ChartConfigFilterType> = {},
  ) => {
    setChart((prev) => {
      let node = getNodeAtPath(
        prev.config.filters,
        path,
        path.length,
      ) as ChartConfigFilterType[];
      node.push({ ...newFilter });
      return prev;
    });
  };
  const updateFilter = (
    path: PathType,
    props: Partial<ChartConfigFilterType>,
  ) => {
    setChart((prev) => {
      let node = getNodeAtPath(
        prev.config.filters,
        path,
        path.length - 1,
      ) as ChartConfigFilterType[];
      node[path[path.length - 1] as number] = {
        ...node[path[path.length - 1] as number],
        ...props,
      } as ChartConfigFilterType;
      return prev;
    });
  };
  const removeFilter = (path: PathType) => {
    setChart((prev) => {
      let node = getNodeAtPath(
        prev.config.filters,
        path,
        path.length - 1,
      ) as ChartConfigFilterType[];
      node.splice(path[path.length - 1] as number, 1);

      if (node.length === 0) {
        if (path.length === 2) {
          prev.config.filters = {};
        } else {
          const parentNode = getNodeAtPath(
            prev.config.filters,
            path,
            path.length - 3,
          ) as ChartConfigFilterType[];

          parentNode.splice(path[path.length - 3] as number, 1);
        }
      }
      return prev;
    });
  };
  const addFilterGroup = (path: PathType) => {
    setChart((prev) => {
      let node = getNodeAtPath(prev.config.filters, path, path.length);
      if (Array.isArray(node)) {
        node.push({ and: [{}] });
      } else {
        node.and = [{}];
      }
      return prev;
    });
  };
  const updateFilterGroup = (
    path: PathType,
    newKey: "and" | "or" | (string & {}),
  ) => {
    setChart((prev) => {
      let node = getNodeAtPath(prev.config.filters, path, path.length);
      const oldKey = newKey === "and" ? "or" : "and";
      node[newKey] = node[oldKey];
      delete node[oldKey];
      return prev;
    });
  };
  const removeFilterGroup = (path: PathType) => {
    setChart((prev) => {
      let node = getNodeAtPath(
        prev.config.filters,
        path,
        path.length - 1,
      ) as ChartConfigFilterType[];
      node.splice(path[path.length - 1] as number, 1);
      if (node.length === 0 && path.length === 2) {
        prev.config.filters = {};
      }
      return prev;
    });
  };

  return (
    <BuilderContext.Provider
      value={{
        isLoading,
        cacheDuration,
        setCacheDuration,
        limit,
        setLimit,
        availableSortProperties,
        sortProperty,
        sortAscending,
        setSortProperty,
        toggleSortAscending,
        joins,
        availableJoins,
        onChangeJoin,
        name,
        setName,
        type,
        setType,
        theme,
        setTheme,
        availableThemes,
        axisX,
        setAxisX,
        axisY,
        setAxisY,
        addAxisY,
        removeAxisY,
        availableAxisProperties,
        filters,
        addFilter,
        updateFilter,
        removeFilter,
        availableFilterProperties,
        addFilterGroup,
        updateFilterGroup,
        removeFilterGroup,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilderContext() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilderContext must be used within BuilderProvider");
  }
  return context;
}
