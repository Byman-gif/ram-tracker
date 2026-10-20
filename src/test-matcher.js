import { matchPartNumber } from "./matcher.js";

const want = { rgb: false, sticks: 1, totalGb: 16 };
for (const p of ["KF556C40BB-16", "KF556C40BBK2-16", "KF556C40BBA-16", "KF556C36BBEK2-16"]) {
  console.log(p, matchPartNumber(p, want));
}