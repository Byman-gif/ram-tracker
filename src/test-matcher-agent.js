import { fetchProduct } from "./fetcher.js";
import { checkListing } from "./matcherAgent.js";

const url = "https://www.verkkokauppa.com/fi/product/756439/Kingston-FURY-Beast-DDR5-5600-MHz-CL40-16-Gt-muistimoduli";
const product = await fetchProduct(url);
console.log(await checkListing(product));