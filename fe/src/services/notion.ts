import {
  Client,
  type DataSourceObjectResponse,
  type PageObjectResponse,
  type QueryDataSourceParameters,
} from "@notionhq/client";
import type { Chart, ChartConfigFilterType } from "@/models/chart";

const ErrorCodes = {
  missing_x_axis: "x-axis.required",
  missing_y_axis: "y-axis.min",
  invalid_limit: "limit.invalid",
  invalid_joins: "joins.invalid",
  invalid_filter_for_multiple_dbs: "filters.invalid_for_multiple_databases",
  invalid_sort_for_multiple_dbs: "sort.invalid_for_multiple_databases",
  not_public: "public.denied",
  something_went_wrong: "SOMETHING_WENT_WRONG",
};

export class NotionService {
  private client: Client;

  constructor(accessToken: string) {
    this.client = new Client({
      auth: accessToken,
      fetch: (url, init) => {
        console.log("[Notion API] Fetching:", url);
        const startTime = Date.now();
        return globalThis.fetch(url, init).then((res) => {
          console.log(
            `[Notion API] Response in ${Date.now() - startTime}ms:`,
            res.status,
            res.headers.get("x-vercel-cache") || "no-cache",
          );
          return res;
        });
      },
    });
  }

  async getDatabases() {
    const response = await this.client.search({
      filter: {
        property: "object",
        value: "data_source",
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    });

    return response.results
      .filter(
        (result): result is DataSourceObjectResponse =>
          result.object === "data_source",
      )
      .map((dataSource) => ({
        id: dataSource.id,
        title: dataSource.title,
        properties: dataSource.properties,
      }));
  }

  async getChartData(chart: Chart, isPublic: boolean = false) {
    this.validateChartConfig(chart, isPublic);

    if (chart.databases.length === 1) {
      return await this.getDataForOneDataSource(chart);
    }

    return await this.getDataForMultipleDataSources(chart);
  }

  private async getDataForOneDataSource(chart: Chart) {
    const res = await this.client.dataSources.query({
      data_source_id: chart.databases[0],
      page_size: chart.config.limit,
      filter_properties: this.getFilterProperties(chart, chart.databases[0]),
      sorts: this.getSorts(chart),
      filter: this.getFilter(chart.config.filters),
      result_type: "page",
    });

    const chartData = this.applyConversionToData(
      res.results.map((r) =>
        this.buildChartDataItem(r as PageObjectResponse, chart.databases[0]),
      ),
      chart.config.axis,
    );

    const chartLabels = this.getChartLabels(
      res.results[0] as PageObjectResponse,
      chart.databases[0],
    );

    console.log("chartLabels",chartLabels);
    return {
      chartData,
      chartLabels,
    };
  }

  private async getDataForMultipleDataSources(chart: Chart) {
    // перевірити якщо ми спокійно можемо зробити лівий джоін, без складної фільтрації та сортування
    const resPrimary = await this.client.dataSources.query({
      data_source_id: chart.databases[0],
      page_size: chart.config.limit,
      filter_properties: Array.from(
        new Set(
          this.getFilterProperties(chart, chart.databases[0]).concat(
            this.splitProperty(chart.config.joins[0].from).propertyId,
          ),
        ),
      ),
      sorts: this.getSorts(chart),
      filter: this.getFilter(chart.config.filters),
      result_type: "page",
    });

    const chartData = resPrimary.results.map((r) =>
      this.buildChartDataItem(r as PageObjectResponse, chart.databases[0]),
    );

    const chartLabels = this.getChartLabels(
      resPrimary.results[0] as PageObjectResponse,
      chart.databases[0],
    );

    console.log("resPrimary", resPrimary, chartData);
    for (let index = 1; index < chart.databases.length; index++) {
      const database = chart.databases[index];
      const isNotRelationJoin = this.splitProperty(
        chart.config.joins[index - 1].to,
      ).propertyId;

      const propertySet = new Set(this.getFilterProperties(chart, database));
      if (chart.config.joins[index])
        propertySet.add(
          this.splitProperty(chart.config.joins[index].from).propertyId,
        );

      if (isNotRelationJoin) {
        // в цьому випадку ми з'єднуємо за будь-яким полем, а не через id
      } else {
        const primaryDataMap = new Map(
          chartData.map((item) => [
            item[chart.config.joins[index - 1].from].id,
            item,
          ]),
        );

        const secondaryRes = await this.client.dataSources.query({
          data_source_id: database,
          filter_properties: Array.from(propertySet),
          sorts: this.getSorts({ config: { sort: null } } as any),
          result_type: "page",
        });
        console.log("secondaryRes", secondaryRes);
        secondaryRes.results
          .filter((r) => primaryDataMap.has(r.id))
          .forEach((r) =>
            Object.assign(
              primaryDataMap.get(r.id)!,
              this.buildChartDataItem(r as PageObjectResponse, database),
            ),
          );
        Object.assign(
          chartLabels,
          this.getChartLabels(
            secondaryRes.results[0] as PageObjectResponse,
            database,
          ),
        );
      }
    }

    return {
      chartData,
      chartLabels,
    };
  }

  private buildChartDataItem(r: PageObjectResponse, id: string) {
    return Object.entries(
      (r as unknown as PageObjectResponse).properties,
    ).reduce(
      (acc, [_, value]) => {
        acc[`${id}::${value.id}`] = this.getPropertiesValue(value);
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  private getChartLabels(r: PageObjectResponse, id: string) {
    if (!r) return {};
    return Object.fromEntries(
      Object.entries(r.properties).map(([key, value]) => {
        return [`${id}::${value.id}`, key];
      }),
    );
  }

  private splitProperty(property: string) {
    const [dataSourceId, propertyId] = property.split("::");
    return { dataSourceId, propertyId };
  }

  private getFilterPropertiesAndDataSources(
    chart: Chart,
    dataSourceId?: string,
  ) {
    return [
      this.splitProperty(chart.config.axis.x.property),
      ...chart.config.axis.y.map((axis) => this.splitProperty(axis.property)),
    ].filter((item) => !dataSourceId || item.dataSourceId === dataSourceId);
  }

  private getUsedDataSourceIds(chart: Chart) {
    return this.getFilterPropertiesAndDataSources(chart).map(
      ({ dataSourceId }) => dataSourceId,
    );
  }

  private getFilterProperties(chart: Chart, dataSourceId?: string) {
    return this.getFilterPropertiesAndDataSources(chart, dataSourceId).map(
      ({ propertyId }) => propertyId,
    );
  }

  private getSorts(chart: Chart): any[] {
    if (chart.config.sort) {
      return [
        {
          property: this.splitProperty(chart.config.sort.property).propertyId,
          direction: chart.config.sort.ascending ? "ascending" : "descending",
        },
      ];
    }
    return [
      {
        timestamp: "last_edited_time",
        direction: "descending",
      },
    ];
  }

  private getFilter(
    group: Chart["config"]["filters"],
    first: boolean = true,
  ): any {
    if ((group.and || group.or || []).length === 0) return undefined;

    if (first && group.and && group.and.length === 1)
      return this.formFilterFromData(group.and[0] as ChartConfigFilterType);

    return (group.and || group.or)!
      .map((filterOrGroup) => {
        if ("and" in filterOrGroup || "or" in filterOrGroup) {
          return this.getFilter(filterOrGroup, false);
        }

        return this.formFilterFromData(filterOrGroup as ChartConfigFilterType);
      })
      .filter((f) => f !== undefined);
  }

  private formFilterFromData(data: ChartConfigFilterType) {
    const value = this.getValueBasedOnOperator(data);
    if (
      !(
        data.operator &&
        data.property &&
        data.type &&
        typeof value !== "undefined"
      )
    )
      return undefined;

    return {
      property: this.splitProperty(data.property!).propertyId,
      [data.type]: {
        [data.operator]: value,
      },
    };
  }

  private getValueBasedOnOperator(data: ChartConfigFilterType) {
    if (["is_empty", "is_not_empty"].includes(data.operator!)) return true;

    if (
      [
        "next_month",
        "next_week",
        "next_year",
        "past_month",
        "past_week",
        "past_year",
        "this_week",
      ].includes(data.operator!)
    )
      return {};

    if (data.type === "checkbox") {
      return data.value === "true";
    }

    return data.value;
  }

  private validateChartConfig(chart: Chart, isPublic: boolean) {
    if (!chart.config.axis.x || !chart.config.axis.x.property) {
      throw new Error(ErrorCodes.missing_x_axis);
    }
    if (chart.config.axis.y.length === 0 || !chart.config.axis.y[0].property) {
      throw new Error(ErrorCodes.missing_y_axis);
    }
    if (chart.config.limit && chart.config.limit < 0) {
      throw new Error(ErrorCodes.invalid_limit);
    }
    if (chart.config.joins.some((join) => !(join.to && join.from))) {
      throw new Error(ErrorCodes.invalid_joins);
    }
    if (
      chart.databases.length > 1 &&
      chart.databases
        .slice(1)
        .some((id) => JSON.stringify(chart.config.filters).includes(id))
    ) {
      throw new Error(ErrorCodes.invalid_filter_for_multiple_dbs);
    }
    if (
      chart.databases.length > 1 &&
      chart.config.sort &&
      chart.databases
        .slice(1)
        .some((id) => chart.config.sort?.property?.includes(id))
    ) {
      throw new Error(ErrorCodes.invalid_sort_for_multiple_dbs);
    }
    //TODO: validate if chart is public
    if (isPublic && !chart.is_public) {
      throw new Error(ErrorCodes.not_public);
    }

    return true;
  }

  private getPropertiesValue(
    property: PageObjectResponse["properties"][string],
  ): any {
    if (property.type === "date") {
      return property[property.type]?.start;
    }
    if (property.type === "formula") {
      return this.getPropertiesValue(
        property[property.type] as PageObjectResponse["properties"][string],
      );
    }
    if (property.type === "title") {
      return property[property.type][0]?.plain_text;
    }

    //@ts-expect-error
    return property[property.type];
  }

  private applyConversionToData(
    data: Record<string, any>[],
    axis: Chart["config"]["axis"],
  ) {
    function toNumber(
      value: any,
      aggregation?: Chart["config"]["axis"]["y"][number]["aggregation"],
    ): number {
      if (typeof value === "string") {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "boolean") {
        return value ? 1 : 0;
      }
      if (Array.isArray(value)) {
        if (aggregation === "sum") {
          return value.reduce((sum, item) => sum + toNumber(item), 0);
        } else if (aggregation === "average") {
          return (
            value.reduce((sum, item) => sum + toNumber(item), 0) / value.length
          );
        } else if (aggregation === "min") {
          return Math.min(...value.map((item) => toNumber(item)));
        } else if (aggregation === "max") {
          return Math.max(...value.map((item) => toNumber(item)));
        } else {
          return value.length;
        }
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length;
      }
      return 0;
    }

    function applyConversionFunctions(
      item: any,
      y: Chart["config"]["axis"]["y"][number],
    ) {
      if (y.conversion === "number") {
        return toNumber(item, y.aggregation);
      } else if (y.conversion === "percentage") {
        return toNumber(item, y.aggregation) * 100;
      }
      return item;
    }

    const shouldGroupBy = axis.y.some((axis) => axis.aggregation);
    if (shouldGroupBy) data = this.applyGrouping(data, axis);

    for (const y of axis.y) {
      if (y.conversion) {
        for (const item of data) {
          item[y.property] = applyConversionFunctions(
            item[y.property],
            y,
          );
        }
      }
    }
    return data;
  }

  private applyGrouping(
    data: Record<string, any>[],
    axis: Chart["config"]["axis"],
  ): Record<string, any>[] {
    const map = new Map<string, Record<string, any>>();

    for (const item of data) {
      const xValue = item[axis.x.property];
      const existing = map.get(xValue);
      if (existing) {
        for (const y of axis.y) {
          existing[y.property].push(item[y.property]);
        }
      } else {
        map.set(
          xValue,
          axis.y.reduce(
            (acc, y) => {
              acc[y.property] = [item[y.property]];
              return acc;
            },
            { [axis.x.property]: xValue } as Record<string, any>,
          ),
        );
      }
    }

    return Array.from(map.values());
  }
}
