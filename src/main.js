import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { fetchProduct } from "./fetcher.js";
import { checkListing } from "./matcherAgent.js";
import { saveCheck } from "./storage.js";
import { priceStats, analyze } from "./analyst.js";
import { notify } from "./notifier.js";

const CONFIG = new URL("../config.json", import.meta.url);
const STATE = new URL("../data/state.json", import.meta.url);

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT" && fallback !== undefined) return fallback;
    throw err;
  }
}

async function checkStore(store, config, state) {
  const product = await fetchProduct(store.url);

  const listing = await checkListing(product);
  if (!listing.match) {
    console.log(`${store.name}: listing doesn't match the target, skipping`, listing);
    return;
  }

  const { pageText, ...check } = product; // save everything except the page text
  const history = await saveCheck({ store: store.name, ...check });

  const stats = priceStats(history, store.name);
  const verdict = await analyze(stats, { store: store.name, alertBelowEur: config.alertBelowEur });
  console.log(`${store.name}: ${check.price} € →`, verdict);

  if (!verdict.alert) {
    delete state.lastAlert[store.name]; // allow a new alert next time
    return;
  }
  if (state.lastAlert[store.name] === check.price) {
    console.log(`${store.name}: already alerted at this price, staying quiet`);
    return;
  }

  await notify({ store: store.name, url: store.url, price: check.price, reason: verdict.reason });
  state.lastAlert[store.name] = check.price;
}

const config = await readJson(CONFIG);
const state = await readJson(STATE, { lastAlert: {} });

for (const store of config.stores) {
  if (!store.url.startsWith("http")) continue; // skip placeholder entries
  try {
    await checkStore(store, config, state);
  } catch (err) {
    console.error(`${store.name}: failed:`, err.message);
  }
}

await writeFile(STATE, JSON.stringify(state, null, 2));