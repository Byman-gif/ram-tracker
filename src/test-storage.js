import { fetchProduct } from "./fetcher.js";
import { saveCheck } from "./storage.js";

const url = "https://www.verkkokauppa.com/fi/product/756439/Kingston-FURY-Beast-DDR5-5600-MHz-CL40-16-Gt-muistimoduli";
const check = { store: "Verkkokauppa.com", ...(await fetchProduct(url)) };
const history = await saveCheck(check);
console.log(`Saved. History now has ${history.length} entries.`);