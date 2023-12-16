"use client";

import { useEffect } from "react";
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export function GameFetcher({ per }: { per: number }) {
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.from("igames").select("period");
      if (error || data.length === 0) {
        return;
      }

      if (data[0].period === per) {
        return router.refresh();
      }
    };

    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [per, router]);

  return <div className="flex">Waiting for the next period</div>;
}
