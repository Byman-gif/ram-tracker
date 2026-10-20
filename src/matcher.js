// Part number pattern
const PART = /^KF556C40BB(A)?(K2)?-(\d+)$/i;

// Match a part number against the desired properties and return true if it matches, false otherwise also checks if number of sticks is correct
export function matchPartNumber(partNo, want) {
  const m = partNo.trim().match(PART);
  if (!m) return false;
  const rgb = Boolean(m[1]);
  const sticks = m[2] ? 2 : 1;
  const totalGb = Number(m[3]);
  return rgb === want.rgb && sticks === want.sticks && totalGb === want.totalGb;
}