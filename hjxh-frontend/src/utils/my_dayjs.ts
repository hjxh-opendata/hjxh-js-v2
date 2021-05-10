/**
 * refer:
 * - [加载语言配置 (NodeJS) · Day.js](https://day.js.org/docs/zh-CN/i18n/loading-into-nodejs)
 * - [Property 'fromNow' does not exist on type 'Dayjs' · Issue #297 · iamkun/dayjs](https://github.com/iamkun/dayjs/issues/297)
 */

import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import dayjsRelativeTimePlugin from "dayjs/plugin/relativeTime"
import dayjsArraySupportPlugin from "dayjs/plugin/arraySupport"

// language support
dayjs.locale("zh-cn")

// "几秒前"
dayjs.extend(dayjsRelativeTimePlugin)

// 传入数组解析时间
dayjs.extend(dayjsArraySupportPlugin)


declare module 'dayjs' {
  interface Dayjs {
    fromNow(): string;
  }
}

export default dayjs
