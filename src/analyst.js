import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export function priceStats(history, store) {
  const prices = history.filter((h) => h.store === store).map((h) => h.price);
  if (prices.length === 0) return null;
  const sum = prices.reduce((a, b) => a + b, 0);
  return {
    current: prices.at(-1),
    previous: prices.length > 1 ? prices.at(-2) : null,
    lowest: Math.min(...prices),
    highest: Math.max(...prices),
    average: Math.round((sum / prices.length) * 100) / 100,
    checks: prices.length,
  };
}

export async function analyze(stats, { store, alertBelowEur }) {
  // Hard rule: your own target price always triggers an alert
  if (stats.current <= alertBelowEur) {
    return { alert: true, reason: `Price ${stats.current} € is at or below your target of ${alertBelowEur} €.` };
  }
  if (stats.checks < 2) {
    return { alert: false, reason: "Not enough price history yet." };
  }

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 200,
    system:
      "You analyze the price history of a RAM module and decide whether a price change " +
      "is worth notifying the buyer about. Reply with only a JSON object, no other text.",
    messages: [{
      role: "user",
      content:
        `Store: ${store}\nBuyer's target price: ${alertBelowEur} €\n` +
        `Price stats in EUR: ${JSON.stringify(stats)}\n\n` +
        "Alert only for a meaningful drop, such as a new lowest price or a drop of several " +
        "percent from the previous check. Ignore small fluctuations and price increases.\n" +
        'Return JSON: {"alert": true or false, "reason": "one short sentence"}',
    }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}