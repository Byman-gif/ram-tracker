import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../data/history.json", import.meta.url);

export async function loadHistory() {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return []; // file doesn't exist yet
    throw err; // anything else (e.g. broken JSON) should stop the run
  }
}

export async function saveCheck(check) {
  const history = await loadHistory();
  history.push(check);
  await writeFile(FILE, JSON.stringify(history, null, 2));
  return history;
}