// import type { SupabaseClient } from "@supabase/supabase-js";
// import { Tables, Database } from "./_database.types";

// export type Chart =  Tables<"workspaces">;

// export class ChartRepository {

//   constructor(protected supabase: SupabaseClient<Database>) {
//   }

//   async getCharts(workspaceId: number): Promise<Chart[]> {
//     return this.supabase
//       .from("test")
//       .select("*")
//       .eq("id", workspaceId)
//       .then(({ data, error }) => {
//         if (error) {
//           console.error("Error fetching charts:", error);
//           return [];
//         }
//         return data as Chart[];
//       });
//   }
// }
