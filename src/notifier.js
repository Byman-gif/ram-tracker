import "dotenv/config";

export async function notify({ store, url, price, reason }) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) throw new Error("DISCORD_WEBHOOK_URL is missing from .env");

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `**RAM price alert: ${price} € at ${store}**\n${reason}\n${url}`,
    }),
  });
  if (!res.ok) throw new Error(`Discord webhook failed: HTTP ${res.status}`);
}