import * as cheerio from "cheerio";

export async function fetchProduct(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "ram-price-tracker (personal project)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

  const $ = cheerio.load(await res.text());
  const meta = (key) =>
    $(`meta[property="${key}"], meta[name="${key}"]`).attr("content");

  const price = Number(meta("product:price:amount"));
  if (!(price > 0)) throw new Error(`No price found on ${url}`);

  return {
    url,
    title: meta("og:title") ?? $("title").text(),
    price,
    currency: meta("product:price:currency") ?? "EUR",
    checkedAt: new Date().toISOString(),
    pageText: ($("main").text() || $("body").text()).replace(/\s+/g, " ").trim(),
  };
}