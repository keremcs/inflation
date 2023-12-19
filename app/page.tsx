import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { DeezButton } from "@/components/deez-button";
import { GameFetcher } from "@/components/game-fetcher";
import { redirect } from "next/navigation";
import { z } from "zod";

import dynamic from "next/dynamic";
const ResultPage = dynamic(() => import("../components/result-page"), {
  ssr: false,
});
const Consume = dynamic(() => import("../components/consume"), {
  ssr: false,
});

export default async function Home() {
  const header = headers();
  const ip = header.get("x-real-ip") ?? "127.0.0.1"; // header.get("x-forwarded-for")

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

  const { data: game, error: gameError } = await supabase
    .from("igames")
    .select("id, active, period");
  if (gameError) {
    redirect(`/?error=${gameError.message}`);
  }

  if (game.length === 0) {
    return (
      <main className="min-h-screen flex justify-center items-center text-2xl p-12">
        <div className="flex">Game not found</div>
      </main>
    );
  }

  const gameId = game[0].id;
  const gamePeriod = game[0].period;
  const gameActive = game[0].active;

  if (!gameActive) {
    const { data: logs, error: logsError } = await supabase
      .from("ilogs")
      .select("balances, expenditure, period, price")
      .eq("game", gameId);
    if (logsError) {
      redirect(`/?error=${logsError.message}`);
    }

    return (
      <main className="min-h-screen flex flex-col justify-center items-center gap-16 py-24">
        <ResultPage data={logs} />
      </main>
    );
  }

  const { data: player, error: playerError } = await supabase
    .from("iplayers")
    .select("id, balance, demand, period")
    .eq("ip", ip)
    .eq("game", gameId);
  if (playerError) {
    redirect(`/?error=${playerError.message}`);
  }

  let playerId = player[0]?.id;
  const demand = player[0]?.demand ?? 0;
  const balance = player[0]?.balance ?? 10;
  const playerPeriod = player[0]?.period ?? 0;

  const fBalance = parseFloat(balance.toFixed(2));

  if (gamePeriod > playerPeriod) {
    return (
      <main className="min-h-screen flex justify-center items-center text-2xl p-12">
        <div className="flex">You are late</div>
      </main>
    );
  }

  if (player.length === 0) {
    const { data: newPlayer, error: newError } = await supabase
      .from("iplayers")
      .insert({
        ip,
        game: gameId,
      })
      .select("id");
    if (newError) {
      redirect(`/?error=${newError.message}`);
    }
    playerId = newPlayer[0]?.id;
  }

  const playerData = {
    fBalance,
    demand,
    period: playerPeriod,
  };

  if (gamePeriod < playerPeriod) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center gap-6 text-2xl p-12">
        <GameFetcher player={playerData} />
      </main>
    );
  }

  async function play(formData: FormData) {
    "use server";

    const schema = z.object({
      amount: z.number().min(0).max(balance),
    });
    const parsed = schema.safeParse({
      amount: Number(formData.get("bid")),
    });
    if (!parsed.success) {
      redirect("/?error=Invalid%20bid%20amount");
    }

    const supabaseAction = createClient<Database>(
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

    const { error } = await supabaseAction
      .from("iplayers")
      .update({
        demand: parsed.data.amount,
        period: playerPeriod + 1,
      })
      .eq("id", playerId)
      .eq("game", gameId);
    if (error) {
      redirect(`/?error=${error.message}`);
    }

    redirect("/");
  }

  const { data: log, error: logError } = await supabase
    .from("ilogs")
    .select("price")
    .eq("game", gameId)
    .eq("period", gamePeriod - 1);
  if (logError) {
    redirect(`/?error=${logError.message}`);
  }

  const price = log[0]?.price ?? 0;

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-6 text-lg sm:text-2xl p-12">
      <div>
        You have <span className="font-bold text-green-400">{fBalance}</span>{" "}
        Game Liras (GL)
      </div>
      <Consume period={gamePeriod} price={price} />
      <form className="flex flex-col gap-6 items-center" action={play}>
        <div className="flex font-bold text-center">
          How much would you spend?
        </div>
        <div>
          <div className="flex">
            <DeezButton val={balance} />
            <DeezButton val={balance * 0.75} />
          </div>
          <div className="flex">
            <DeezButton val={balance * 0.5} />
            <DeezButton val={balance * 0.25} />
          </div>
        </div>
      </form>
    </main>
  );
}
