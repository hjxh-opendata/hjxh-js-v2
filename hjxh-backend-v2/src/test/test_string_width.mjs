import stringWidth from "string-width";
// const stringWidth = require('string-width')

const f = (s, w=30) => {
  const l = stringWidth(s)
  s += '-'.repeat(w - l)
  console.log(s);
}

f('皇家小虎食品旗舰店雷港', 30)
f('牧鲜生:硬汉猛男', 30)