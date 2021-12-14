import { Controller, Get, Query, ParseIntPipe, Res } from "@nestjs/common";
import { Response } from "express";
import  fs from "fs";
import path from "path";
import { DEFAULT_GOODS_ID, DEFAULT_MALL_ID, DEFAULT_MALL_NAME, OUTPUT_DIR } from "../const";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { execFile } from "child_process";

@ApiTags("Download")
@Controller("download")
export class DownloadController {

  // https://stackoverflow.com/a/2938188/9422455
  @Get()
  @ApiQuery({name: 'mallName', example:DEFAULT_MALL_NAME})
  @ApiQuery({name: 'goodsId', example: DEFAULT_GOODS_ID})
  @ApiQuery({name: 'startDate', example: '2021-05-18'})
  @ApiQuery({name: 'endDate', example: '2021-05-21'})
  public async getTest(
    @Query('mallName') mallName: string,
    @Query('goodsId', ParseIntPipe) goodsId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response
  ) {
    const fileName = `${mallName}-${goodsId}-${startDate}-${endDate}.xlsx`
    const filePath = path.join(OUTPUT_DIR, fileName);
    if(!fs.existsSync(filePath)){
      const scriptPath = '/Users/mark/projects/HJXH/hjxh-py/analysis/output/gen.py'
      execFile(`python ${scriptPath} ${mallName}  ${goodsId} ${startDate} ${endDate}`, (err, stdout, stderr) => {
        console.log({err, stdout, stderr});
      })
    }
    return 'ok'

  }


}
