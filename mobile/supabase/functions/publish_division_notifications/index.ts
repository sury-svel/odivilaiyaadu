// @ts-nocheck

// Enable Supabase Edge Functions types in your editor
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Import the JS client for your database calls
import { createClient } from "jsr:@supabase/supabase-js@2";
import mustache from 'https://cdn.skypack.dev/mustache@4.2.0';


// Initialize a Supabase client with the built-in service role key
// console.log("SUPABASE_URL:", Deno.env.get("SUPABASE_URL"));
// console.log("SERVICE_ROLE_KEY exists:", !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Deno.serve will handle incoming HTTP requests
Deno.serve(async (req) => {
  try {
    // 1 Parse the incoming JSON payload
    const { template_id, params, division_id } = await req.json();
    const { lang, game, division, location } = params;

    // 2 Fetch all child IDs with a score > 0 in this division
    const { data: scored, error: scoreErr } = await supabase
      .from("game_scores")
      .select("child_id")
      .eq("division_id", division_id)
      .gt("score", 0);
    if (scoreErr) throw scoreErr;
    const childIds = scored!.map((r) => r.child_id);

    // 3  look up their parents
    const { data: kids } = await supabase
      .from("children")
      .select("parent_id")
      .in("id", childIds);
    const parentIds = kids!.map((k) => k.parent_id);

    // 4 Fetch all non-null parent push tokens
    const { data: profiles, error: profErr } = await supabase
      .from("user_profiles")
      .select("push_token")
      .in("id", parentIds)
      .not("push_token", "is", null);
    if (profErr) throw profErr;
    const tokens = profiles!.map((p) => p.push_token) as string[];

    // 5 fetch the template
    const { data: tpl, error: tplErr } = await supabase
      .from("notification_templates")
      .select("message_en, message_ta")
      .eq("id", template_id)
      .single();
    if (tplErr || !tpl) {
      return new Response(JSON.stringify({ error: "Template not found" }), {
        status: 400,
      });
    }

    // 6 pick language from params or default to English
    const raw = lang === "ta" ? tpl.message_ta! : tpl.message_en!;
    const body = mustache.render(raw, { game, division, location });

    // 7 Build Expo Push messages
    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: `${game} – ${division}`,
      body,
    }));

    // 8 Send in batches of 100 to the Expo Push API
    for (let i = 0; i < messages.length; i += 100) {
      const chunk = messages.slice(i, i + 100);
      console.log("Sending chunk:", chunk);

      // consistently name it `response`
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chunk),
      });

      // log non-2xx status bodies
      if (!response.ok) {
        const text = await response.text();
        console.error(
          `Expo Push API returned HTTP ${response.status}: ${text}`
        );
        continue;
      }

      // parse the JSON tickets
      let tickets: any[];
      try {
        tickets = await response.json();
      } catch (e) {
        console.error("Failed to parse Expo tickets JSON:", e);
        continue;
      }

      // log the tickets so you can inspect status/id/errors
      console.log("Expo Push tickets response:", tickets);

      // surface any per-ticket failures
      for (let idx = 0; idx < tickets.length; idx++) {
        const ticket = tickets[idx];
        if (ticket.status !== "ok") {
          console.error(`Ticket ${idx} failed:`, ticket);
        }
      }
    }

    // 9 Respond with the number of notifications attempted
    return new Response(JSON.stringify({ published: tokens.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Edge Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
