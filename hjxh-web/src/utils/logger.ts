import dayjs from "dayjs"

export const getTime = (): string => {
  return dayjs().format("MM-DD HH:mm:ss")
}

export const getFileName = (): string => {
  return __filename
}

export const logger = {
  info: (...args: any[]) => {
    console.log(
      `%c[I] ${getTime()} ${getFileName()}: `,
      "color:green;",
      ...args,
    )
  },
  warning: (...args: any[]) => {
    console.log(
      `%c[W] ${getTime()} ${getFileName()}: `,
      "color:magenta;",
      ...args
    )
  },
  error: (...args: any[]) => {
    console.log(`%c[E] ${getTime()} ${getFileName()}: `, "color:red;", ...args)
  },
}

export default logger
