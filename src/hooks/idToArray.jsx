export const toIdArray = (arr = []) =>
  arr.map((x) => (typeof x === "string" ? x : x?.id)).filter(Boolean);
