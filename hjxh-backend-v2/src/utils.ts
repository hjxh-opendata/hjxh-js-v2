const getStringWidthViaEsm = (s: string): number => {
  return require("string-width")(s);
};

const getStringWidthViaRe = (s: string): number => {
  return s.split("").reduce((L: number, i: string) => ((L += 2 + i.search(/[\u4e00-\u9fa5]/)), L), 0);
};

export const visualPad = (s: string, w = 30, padWord=' ', padAtRight = true): string => {
  const L = getStringWidthViaRe(s);
  const p = padWord.repeat(Math.max(0, w - L));
  if (padAtRight) return s + p;
  else return p + s;
};

if (require.main === module) {
  console.log(visualPad("皇家小虎食品旗舰店雷港"));
  console.log(visualPad("千寻生鲜:小可爱"));
  console.log(visualPad("乐和食品店:冯露"));
}
