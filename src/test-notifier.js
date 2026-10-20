import { notify } from "./notifier.js";

await notify({
  store: "Verkkokauppa.com",
  url: "https://www.verkkokauppa.com/fi/product/756439/Kingston-FURY-Beast-DDR5-5600-MHz-CL40-16-Gt-muistimoduli",
  price: 299.99,
  reason: "Test alert: this is not a real price drop.",
});
console.log("Sent!");