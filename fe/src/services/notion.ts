import { type Chart } from "@/models/chart";
import {
  Client,
  type DataSourceObjectResponse,
  type QueryDataSourceParameters,
} from "@notionhq/client";

const ErrorCodes = {
  missing_x_axis: "MISSING_X_AXIS",
  missing_y_axis: "MISSING_Y_AXIS",
  invalid_limit: "INVALID_LIMIT",
  invalid_joins: "INVALID_JOINS",
  something_went_wrong: "SOMETHING_WENT_WRONG",
};

export class NotionService {
  private client: Client;

  constructor(accessToken: string) {
    this.client = new Client({
      auth: accessToken,
      fetch: globalThis.fetch,
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

    return response.results.filter(
      (result): result is DataSourceObjectResponse =>
        result.object === "data_source",
    );
  }

  async getChartData(chart: Chart) {
    try {
      if (chart.databases.length === 1) {
        const body = {
          data_source_id: chart.databases[0],
          page_size: chart.config.limit,
          filter_properties: this.getFilterProperties(chart),
          sorts: this.getSorts(chart),
          filter: this.getFilter(chart.config.filters),
          result_type: "page",
        } as QueryDataSourceParameters;
        const res = await this.client.dataSources.query(body);
        console.log("NotionService.getChartData", res, body);
        return { data: res.results, error: null };
      }

      this.validateChartConfig(chart);

      return { data: [], error: null };
    } catch (error) {
      return { data: [], error: (error as Error).message };
    }
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

  private getFilter(group: Chart["config"]["filters"]) {
    if (!(group.and || group.or)) return undefined;

    (group.and || group.or)!.forEach((filterOrGroup: any) => {
      if ("and" in filterOrGroup || "or" in filterOrGroup) {
        return this.getFilter(filterOrGroup);
      }

      if ("type" in filterOrGroup) {
        filterOrGroup[filterOrGroup.type] = {
          [filterOrGroup.operator]: filterOrGroup.value,
        };
        delete filterOrGroup.operator;
        delete filterOrGroup.value;
        delete filterOrGroup.type;
        const { propertyId } = this.splitProperty(filterOrGroup.property!);
        filterOrGroup.property = propertyId;
      }
      return filterOrGroup;
    });
    return group as any;
  }

  private validateChartConfig(chart: Chart) {
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

    return true;
  }
}
