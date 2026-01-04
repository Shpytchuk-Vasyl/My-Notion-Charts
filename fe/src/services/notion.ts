import { Client, DataSourceObjectResponse } from "@notionhq/client";

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
}
