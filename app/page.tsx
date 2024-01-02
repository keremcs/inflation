import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { DeezButton } from "@/components/deez-button";
import { LoadingButton } from "@/components/loading-button";
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
  const ip = header.get("x-real-ip") ?? "95.183.240.91"; // header.get("x-forwarded-for")
  const reverseIp = ip.split(".").reverse();
  const iHope = reverseIp[0] + reverseIp[1];

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

  const { data: player, error: playerError } = await supabase
    .from("iplayers")
    .select("id, username, apple, balance, demand, period")
    .eq("ip", ip)
    .eq("game", gameId);
  if (playerError) {
    redirect(`/?error=${playerError.message}`);
  }

  const playerId = player[0]?.id;
  const playerName = player[0]?.username ?? "deez.nuts";
  const apple = player[0]?.apple ?? 0;
  const demand = player[0]?.demand ?? 0;
  const balance = player[0]?.balance ?? 10;
  const playerPeriod = player[0]?.period ?? 0;

  const fApple = parseFloat(apple.toFixed(2));
  const fBalance = parseFloat(balance.toFixed(2));

  if (!gameActive) {
    const { data: logs, error: logsError } = await supabase
      .from("ilogs")
      .select("balances, expenditure, period, price")
      .eq("game", gameId);
    if (logsError) {
      redirect(`/?error=${logsError.message}`);
    }

    return (
      <main className="min-h-screen flex flex-col justify-center items-center p-12">
        <ResultPage apple={fApple} data={logs} username={playerName} />
      </main>
    );
  }

  // if (ip.startsWith("95.183.240")) {
  //   return (
  //     <main className="min-h-screen flex justify-center items-center text-2xl p-12">
  //       <div className="flex text-center">Please use your cellular network</div>
  //     </main>
  //   );
  // }

  if (gamePeriod > playerPeriod) {
    return (
      <main className="min-h-screen flex justify-center items-center text-2xl p-12">
        <div className="flex">You are late</div>
      </main>
    );
  }

  async function username(formData: FormData) {
    "use server";

    const uchema = z.object({
      username: z
        .string()
        .min(3)
        .max(11)
        .regex(/^[a-zA-Z0-9]+$/),
    });
    const uparsed = uchema.safeParse({
      username: formData.get("username"),
    });
    if (!uparsed.success) {
      redirect("/?error=Invalid%20username");
    }

    const supabaseUction = createClient<Database>(
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

    const unique = uparsed.data.username + "." + iHope;

    const { error: newError } = await supabaseUction.from("iplayers").insert({
      ip,
      game: gameId,
      username: unique,
    });
    if (newError) {
      redirect(`/?error=${newError.message}`);
    }

    redirect("/");
  }

  if (player.length === 0 && gamePeriod === 0) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center p-12">
        <form className="flex flex-col gap-6" action={username}>
          <div className="flex justify-center">Enter your username</div>
          <input
            className="px-4 py-2 border rounded-md"
            type="text"
            name="username"
            placeholder="Username"
            pattern="[a-zA-Z0-9]{3,11}"
            required
          />
          <LoadingButton />
        </form>
      </main>
    );
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

    const supabaseEction = createClient<Database>(
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

    const { error: rpcError } = await supabaseEction.rpc("safeplay", {
      dema: parsed.data.amount,
      game_id: gameId,
      peri: gamePeriod,
      player_id: playerId,
    });
    if (rpcError) {
      redirect(`/?error=${rpcError.message}`);
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
  const splitter = playerName.split(".");
  const firstName = splitter[0];
  const uniqueName = splitter[1];

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-6 text-lg sm:text-2xl p-12">
      <div>
        {firstName}
        <span className="opacity-25">#{uniqueName}</span>
      </div>
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
