/**
 * 结论：会继续运行的
 * @param milliseconds
 */

const sleep = async (milliseconds: number) =>
{
  console.log('started sub')
  await new Promise((resolve: any) => {
    setTimeout(resolve, milliseconds);
  })
  console.log('finished sub')
}


(
  async () => {
    console.log('started main')
    console.time('xx')
    sleep(3000)
    console.timeEnd('xx')
    console.log('finished main')
  }
)()
