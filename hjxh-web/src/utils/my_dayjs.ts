/**
 * refer:
 * - [加载语言配置 (NodeJS) · Day.js](https://day.js.org/docs/zh-CN/i18n/loading-into-nodejs)
 * - [Property 'fromNow' does not exist on type 'Dayjs' · Issue #297 · iamkun/dayjs](https://github.com/iamkun/dayjs/issues/297)
 */

import dayjs from "dayjs"
import "dayjs/locale/zh-cn"

dayjs.locale("zh-cn")
dayjs.extend(require("dayjs/plugin/relativeTime"))


declare module 'dayjs' {
  interface Dayjs {
    fromNow(): string;
  }
}

export default dayjs
