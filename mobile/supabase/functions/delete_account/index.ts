// @ts-nocheck

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), { status: 400 });
    }

    console.log("Deleting user:", user_id);

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user_id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "User profile not found" }), { status: 404 });
    }

    const role = profile.role;

    console.log("User role:", role);

    if (role === "parent") {
      console.log("Deleting game regs for parent:", user_id);
      await supabase.from("event_game_registration").delete().eq("user_id", user_id);

      const { data: children } = await supabase
        .from("children")
        .select("id")
        .eq("parent_id", user_id);

      console.log("Children found:", children);

      const childIds = children?.map((c) => c.id) || [];

      if (childIds.length > 0) {
        console.log("Deleting game scores:", childIds);
        await supabase.from("game_scores").delete().in("child_id", childIds);
        console.log("Deleting children:", childIds);
        await supabase.from("children").delete().in("id", childIds);
      }
    } else if (role === "volunteer") {
      // console.log("Deleting game regs:", user_id);
      // await supabase.from("event_game_registration").delete().eq("user_id", user_id);
       console.log("Deleting volunteer assignments:", user_id);
      await supabase.from("game_volunteer_assignments").delete().eq("user_id", user_id);
    }

    await supabase.from("user_profiles").delete().eq("id", user_id);

    const { error: authError } = await supabase.auth.admin.deleteUser(user_id);

    if (authError) {
      return new Response(JSON.stringify({ error: "Failed to delete from auth" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Account deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Account deletion error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
