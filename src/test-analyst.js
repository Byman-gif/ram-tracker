import { analyze } from "./analyst.js";

const config = { store: "Verkkokauppa.com", alertBelowEur: 250 };
const scenarios = {
  "small wobble":  { current: 344.99, previous: 346.99, lowest: 339.99, highest: 349.99, average: 346.5, checks: 10 },
  "real drop":     { current: 309.99, previous: 346.99, lowest: 309.99, highest: 349.99, average: 345.0, checks: 10 },
  "price went up": { current: 359.99, previous: 346.99, lowest: 339.99, highest: 359.99, average: 347.0, checks: 10 },
  "hit target":    { current: 249.0,  previous: 346.99, lowest: 249.0,  highest: 349.99, average: 340.0, checks: 10 },
};

for (const [name, stats] of Object.entries(scenarios)) {
  console.log(name, await analyze(stats, config));
}