import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { AdService } from "./ad.service";
import { DEFAULT_GOODS_ID } from "../const";
import { getLastDateStr } from "../utils";

@ApiTags('Advertisement')
@Controller('ad')
export class AdController {
  constructor(private adService: AdService){}

  @Get('analysis')
  @ApiQuery({name: "goodsId", example: DEFAULT_GOODS_ID})
  @ApiQuery({name: "startDate", example: getLastDateStr()})
  @ApiQuery({name: "endDate", example: getLastDateStr()})
  private analyzeOrders(
    @Query('goodsId', ParseIntPipe) goodsId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adService.analyzeAd(goodsId, startDate, endDate)
  }

}
