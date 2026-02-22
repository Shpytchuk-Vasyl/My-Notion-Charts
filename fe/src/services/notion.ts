import {
  Client,
  type DataSourceObjectResponse,
  type PageObjectResponse,
  type QueryDataSourceParameters,
} from "@notionhq/client";
import { getMessages } from "next-intl/server";
import type { Chart, ChartConfigFilterType } from "@/models/chart";

const ErrorCodes = {
  missing_x_axis: "x-axis.required",
  missing_y_axis: "y-axis.min",
  invalid_limit: "limit.invalid",
  invalid_joins: "joins.invalid",
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
    await this.validateChartConfig(chart, isPublic);

    if (chart.databases.length === 1) {
      const res = await this.client.dataSources.query({
        data_source_id: chart.databases[0],
        page_size: chart.config.limit,
        filter_properties: this.getFilterProperties(chart),
        sorts: this.getSorts(chart),
        filter: this.getFilter(chart.config.filters),
        result_type: "page",
      });

      const chartData = res.results.map((r) =>
        this.buildChartDataItem(r as PageObjectResponse, chart.databases[0]),
      );
      const chartLabels = this.getChartLabels(
        res.results[0] as PageObjectResponse,
        chart.databases[0],
      );
      return {
        chartData,
        chartLabels,
      };
    }

    return {
      chartData: [],
      chartLabels: {},
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

  private getFilterPropertiesAndDataSources(chart: Chart) {
    return [
      this.splitProperty(chart.config.axis.x.property),
      ...chart.config.axis.y.map((axis) => this.splitProperty(axis.property)),
    ];
  }

  private getUsedDataSourceIds(chart: Chart) {
    return this.getFilterPropertiesAndDataSources(chart).map(
      ({ dataSourceId }) => dataSourceId,
    );
  }

  private getFilterProperties(chart: Chart) {
    return this.getFilterPropertiesAndDataSources(chart).map(
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

  private async validateChartConfig(chart: Chart, isPublic: boolean) {
    const t = (await getMessages())["validation"];
    if (!chart.config.axis.x || !chart.config.axis.x.property) {
      throw new Error(t[ErrorCodes.missing_x_axis]);
    }
    if (chart.config.axis.y.length === 0 || !chart.config.axis.y[0].property) {
      throw new Error(t[ErrorCodes.missing_y_axis]);
    }
    if (chart.config.limit && chart.config.limit < 0) {
      throw new Error(t[ErrorCodes.invalid_limit]);
    }
    if (chart.config.joins.some((join) => !(join.to && join.from))) {
      throw new Error(t[ErrorCodes.invalid_joins]);
    }
    //TODO: validate if chart is public
    if (isPublic && !(chart as any).is_public) {
      throw new Error(t[ErrorCodes.not_public]);
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
}
