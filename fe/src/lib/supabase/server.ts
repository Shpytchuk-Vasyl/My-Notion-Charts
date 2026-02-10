import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { Database } from "@/models/_database.types";

export async function createClient(cookiesStore?: NextRequest["cookies"]) {
  const cookieStore = cookiesStore ?? (await cookies());

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      global: {
        fetch: (url, init) => {
          console.log('[Supabase API] Fetching:', url);
          const start = Date.now();
          return globalThis.fetch(url, init).then(response => {
            const duration = Date.now() - start;
            const cache = response.headers.get('x-vercel-cache') || 'UNKNOWN';
            console.log(`[Supabase API] Response: ${response.status} in ${duration}ms [Cache: ${cache}]`);
            return response;
          });
        },
      },
    },
  );
}
