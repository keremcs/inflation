import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { redirect } from "next/navigation";
import Hamburger from "@/components/hamburger";

export const dynamic = "force-dynamic";

export default async function Result() {
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

  const { data, error } = await supabase
    .from("cbgame")
    .select("username, s1, s2")
    .limit(5);
  if (error || data.length === 0) {
    redirect("/");
  }

  const aggregate = data.map((d) => {
    return {
      username: d.username,
      score: d.s1 + d.s2,
    };
  });

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex flex-row justify-center border-b h-[57px]">
        <div className="flex items-center justify-between max-w-4xl w-full px-4">
          <div className="flex w-[90px] justify-start">
            <Hamburger />
          </div>
          <a href="/" className="hidden sm:flex text-3xl font-semibold">
            MacroGames
          </a>
          <div className="flex w-[90px] justify-end"></div>
        </div>
      </div>
      <div className="flex flex-col grow items-center justify-center gap-6">
        <div className="text-4xl">Leaderboard</div>
        <ul className="flex flex-col text-2xl gap-3">
          {aggregate
            .sort((a, b) => b.score - a.score)
            .map((d, i) => (
              <li key={d.username} className="flex justify-between gap-6">
                <div>{i + 1 + ". " + d.username}</div>
                <div>{d.score.toFixed(2)}</div>
              </li>
            ))}
        </ul>
      </div>
    </main>
  );
}
