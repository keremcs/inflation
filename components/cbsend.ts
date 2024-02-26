"use server";

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { redirect } from "next/navigation";

export async function cbsend(
  id: string,
  game: number,
  s1?: number,
  s2?: number
) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  const updateObject = {
    id,
    game,
    ...(s1 ? { s1 } : { s2 }),
  };

  const { error } = await supabase
    .from("cbgame")
    .update(updateObject)
    .eq("id", id);
  if (error) {
    return { message: error.message };
  }

  redirect("/");
}
