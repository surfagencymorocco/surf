// Supabase Edge Function: send-email
// Sends customer emails via nodemailer SMTP and optional Telegram notifications.
// Deploy:  supabase functions deploy send-email
// Secrets: supabase secrets set TELEGRAM_ENABLED TELEGRAM_NOTIFY_ON_NEW_BOOKING TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @deno-types="npm:@types/nodemailer@6.4.14"
import nodemailer from "npm:nodemailer@6.9.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { to, subject, html, host, port, user, pass, from, telegram_data } = body;

    // ── 1. EMAIL (always sent first) ──
    const emailResult = await sendCustomerEmail({
      to, subject, html, host, port, user, pass, from,
    });

    // ── 2. TELEGRAM (only if email succeeded) ──
    let telegramResult: { success: boolean; error: string | null } = {
      success: false,
      error: null,
    };

    if (!emailResult.success) {
      console.log("[Telegram] Notification skipped — email did not succeed");
      telegramResult = { success: false, error: "Email did not succeed" };
    } else if (!telegram_data) {
      console.log("[Telegram] Notification skipped — no reservation data");
      telegramResult = { success: false, error: "No telegram_data provided" };
    } else {
      const notifyNewBooking = Deno.env.get("TELEGRAM_NOTIFY_ON_NEW_BOOKING");
      if (notifyNewBooking === "false") {
        console.log("[Telegram] Notification skipped — TELEGRAM_NOTIFY_ON_NEW_BOOKING is false");
        telegramResult = { success: false, error: "TELEGRAM_NOTIFY_ON_NEW_BOOKING is false" };
      } else {
        try {
          telegramResult = await sendTelegramNotification(telegram_data);
        } catch (err: any) {
          console.error("[Telegram] Unexpected exception:", err.message);
          telegramResult = { success: false, error: err.message };
        }
      }
    }

    // ── 3. Always return success — Telegram is optional ──
    return new Response(
      JSON.stringify({ email: emailResult, telegram: telegramResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[send-email] Fatal error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ─────────────────────────────────────────────────────────────
// Customer email via nodemailer SMTP
// ─────────────────────────────────────────────────────────────

async function sendCustomerEmail(cfg: {
  to: string;
  subject: string;
  html: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}): Promise<{ success: boolean; error: string | null }> {
  if (!cfg.host || !cfg.port || !cfg.user || !cfg.pass || !cfg.from) {
    console.warn("[send-email] Missing SMTP configuration");
    return { success: false, error: "Missing SMTP configuration" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: Number(cfg.port),
      secure: Number(cfg.port) === 465,
      auth: { user: cfg.user, pass: cfg.pass },
    });

    await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      subject: cfg.subject,
      html: cfg.html,
    });

    console.log("[send-email] Email sent to", cfg.to);
    return { success: true, error: null };
  } catch (err: any) {
    console.error("[send-email] Email error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Telegram notification (optional, never throws)
// ─────────────────────────────────────────────────────────────

async function sendTelegramNotification(data: Record<string, any>): Promise<{
  success: boolean;
  error: string | null;
}> {
  const telegramEnabled = Deno.env.get("TELEGRAM_ENABLED") === "true";
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!telegramEnabled) {
    console.log("[Telegram] Telegram disabled");
    return { success: false, error: "TELEGRAM_ENABLED is not true" };
  }

  if (!botToken || !chatId) {
    console.warn("[Telegram] Missing configuration");
    return { success: false, error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID" };
  }

  try {
    const text = buildTelegramMessage(data);

    const tgRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    let tgData: any;
    try {
      tgData = await tgRes.json();
    } catch {
      console.error("[Telegram] Invalid response — could not parse JSON");
      return { success: false, error: "Invalid Telegram API response" };
    }

    if (tgData.ok) {
      console.log("[Telegram] Notification sent");
      return { success: true, error: null };
    }

    console.error("[Telegram] API error:", tgData.description || "Unknown");
    return { success: false, error: tgData.description || "Unknown Telegram API error" };
  } catch (err: any) {
    console.error("[Telegram] API error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Telegram message builder
// ─────────────────────────────────────────────────────────────

function buildTelegramMessage(data: Record<string, any>): string {
  return [
    "\u{1F3C4} <b>NEW SURF BOOKING</b>",
    "",
    "\u{1F194} <b>Reservation</b>",
    esc(data.id),
    "",
    "\u{1F464} <b>Name</b>",
    esc(data.full_name),
    "",
    "\u{1F4E7} <b>Email</b>",
    esc(data.email),
    "",
    "\u{1F4F1} <b>Phone</b>",
    esc(data.phone),
    "",
    "\u{1F3C4} <b>Surf Level</b>",
    esc(data.surf_level),
    "",
    "\u{1F4CD} <b>Destination</b>",
    esc(data.destination),
    "",
    "\u{1F4C5} <b>Preferred Date</b>",
    esc(data.preferred_date),
    "",
    "\u{1F4AC} <b>Message</b>",
    data.message ? esc(data.message) : "\u2014",
    "",
    "\u{1F552} <b>Created</b>",
    esc(data.created_at),
    "",
    "\u2501".repeat(18),
    "",
    "\u{1F310} <b>Website</b>",
    "https://surfagencymorocco.com",
    "",
    "\u2501".repeat(18),
    "",
    '\u{1F517} <a href="https://surfagencymorocco.com/admin/dashboard.html">Open Admin Dashboard</a>',
  ].join("\n");
}

function esc(value: any): string {
  const str = value != null ? String(value) : "N/A";
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
