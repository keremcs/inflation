import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Admin() {
  const password = cookies().get("adminpw")?.value;

  async function setCookie(formData: FormData) {
    "use server";

    const yummy = String(formData.get("adminpw"));
    cookies().set("adminpw", yummy);

    redirect("/admin");
  }

  async function admin(formData: FormData) {
    "use server";

    const pw = String(formData.get("dn"));
    if (pw !== process.env.NEXT_PRIVATE_ADMIN_PASSWORD) {
      redirect("/admin?error=Wrong%20password");
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

    const id = Number(formData.get("id"));
    const per = Number(formData.get("per"));
    const inc = Number(formData.get("inc"));
    const { error: rpcError } = await supabaseAction.rpc("magic", {
      game_id: id,
      income: inc,
      perio: per,
    });
    if (rpcError) {
      redirect(`/admin?error=${rpcError.message}`);
    }

    redirect("/admin");
  }

  if (password === process.env.NEXT_PRIVATE_ADMIN_PASSWORD) {
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
      .select("id, period");
    if (gameError) {
      redirect(`/admin?error=${gameError.message}`);
    }
    if (game.length === 0) {
      redirect("/admin?error=Game%20not%20found");
    }
    const gameId = game[0].id;
    const gamePeriod = game[0].period;

    return (
      <main className="min-h-screen flex flex-col justify-center items-center text-2xl gap-6 p-12">
        <div>Game: {gameId}</div>
        <div>Period: {gamePeriod}</div>
        <form className="flex flex-wrap justify-center gap-6" action={admin}>
          <input type="number" inputMode="numeric" name="inc" required />
          <Button type="submit">Magic</Button>
          <input type="hidden" name="dn" value={password} />
          <input type="hidden" name="id" value={gameId} />
          <input type="hidden" name="per" value={gamePeriod} />
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center items-center text-2xl p-12">
      <form className="flex flex-wrap justify-center gap-6" action={setCookie}>
        <input type="password" name="adminpw" placeholder="Password" />
        <Button type="submit">Enter</Button>
      </form>
    </main>
  );
}
