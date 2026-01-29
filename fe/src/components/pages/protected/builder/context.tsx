"use client";

import { type Chart } from "@/models/chart";
import { createContext, useContext, useEffect, useState } from "react";
import { useDashboardContext } from "@/pages/protected/general/dashboard/context";
import { useParams } from "next/navigation";
import { type PartialDataSourceObjectResponse } from "@notionhq/client";
import { chartThemeNames } from "@/components/block/chart/themes";

type SortProperty = {
  name: string;
  value: string;
  type: string;
};

type AvailableJoinType = {
  id: string;
  name: string;
  from: PartialDataSourceObjectResponse["properties"]["key"][];
  to: PartialDataSourceObjectResponse["properties"]["key"][];
};

interface BuilderContextType {
  isLoading: boolean;
  cacheDuration: number | undefined;
  setCacheDuration: (duration: number) => void;
  availableCacheDurations: SortProperty[];
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
  setAxisY: (index: number, property: string, aggregation: string) => void;
  addAxisY: () => void;
  availableAxisProperties: SortProperty[];
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
  const setChart: React.Dispatch<React.SetStateAction<Chart | null>> = (
    updater,
  ) => {
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
      if (!prev) return prev;
      prev.config.cache.duration = duration;
      return prev;
    });
  };
  const availableCacheDurations = [
    { name: "without", value: 0 },
    { name: "tenMin", value: 10 * 60 },
    { name: "oneHour", value: 60 * 60 },
    { name: "sixHours", value: 6 * 60 * 60 },
    { name: "twelveHours", value: 12 * 60 * 60 },
    { name: "oneDay", value: 24 * 60 * 60 },
  ] as unknown as SortProperty[];

  //
  // limit management
  //
  const limit = chart?.config?.limit;
  const setLimit = (newLimit: number | undefined) => {
    setChart((prev) => {
      if (!prev) return prev;
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
      if (!prev) return prev;
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
      if (!prev || !prev.config.sort) return prev;
      prev.config.sort.ascending = ascending;
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
        id: `${db.id}::${prop.id}`,
      })),
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
      if (!prev) return prev;
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
      if (!prev) return prev;
      prev.name = newName;
      return prev;
    });
  };
  const type = chart?.type;
  const setType = (newType: string) => {
    setChart((prev) => {
      if (!prev) return prev;
      prev.type = newType as Chart["type"];
      return prev;
    });
  };
  const theme = chart?.config?.customization.theme;
  const setTheme = (newTheme: string) => {
    setChart((prev) => {
      if (!prev) return prev;
      prev.config.customization.theme = newTheme;
      return prev;
    });
  };
  const availableThemes = chartThemeNames.map((theme) => ({
    name: theme,
    value: theme,
  }));

  //
  // axis management
  //
  const availableAxisProperties = availableSortProperties;
  const axisX = chart?.config?.axis?.x?.property;
  const axisY = chart?.config?.axis?.y ?? [];
  const setAxisX = (property: string) => {
    setChart((prev) => {
      if (!prev) return prev;
      prev.config.axis.x.property = property;
      return prev;
    });
  };
  const setAxisY = (index: number, property: string, aggregation: string) => {
    setChart((prev) => {
      if (!prev) return prev;
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
      if (!prev) return prev;
      prev.config.axis.y.push({ property: "", aggregation: "none" });
      return prev;
    });
  };

  return (
    <BuilderContext.Provider
      value={{
        isLoading,
        cacheDuration,
        setCacheDuration,
        availableCacheDurations,
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
        availableAxisProperties,
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
