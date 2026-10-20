import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { matchPartNumber } from "./matcher.js";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY automatically

const WANT = { speedMhz: 5600, cl: 40, rgb: false, sticks: 1, totalGb: 16 };

export async function checkListing({ title, pageText }) {
  // 1. Exact and free: a part number is visible on the page
  const part = pageText.match(/KF5\d{2}C\d{2}B\w*-\d+/i)?.[0];
  if (part) {
    return { match: matchPartNumber(part, WANT), method: "part number", part };
  }

  // 2. Fallback: the model reads the listing, code makes the decision
  const specs = await extractSpecs(title, pageText);
  const match = Object.keys(WANT).every((key) => specs[key] === WANT[key]);
  return { match, method: "llm", specs };
}

async function extractSpecs(title, pageText) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 200,
    system: "You extract RAM specs from product listings. Reply with only a JSON object, no other text.",
    messages: [{
      role: "user",
      content:
        `Product title: ${title}\n\nPage text:\n${pageText.slice(0, 6000)}\n\n` +
        "Return JSON with these fields: speedMhz (number), cl (number), " +
        "rgb (true only if the listing mentions RGB lighting, otherwise false), " +
        "sticks (number of modules), totalGb (total capacity in GB). " +
        "Use null for any number the listing doesn't state.",
    }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}