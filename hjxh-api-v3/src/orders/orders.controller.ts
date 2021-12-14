import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { DEFAULT_GOODS_ID } from "../const";
import { getLastDateStr } from "../utils";
import { OrdersService } from "./orders.service";


@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService){}


  @Get('analysis')
  @ApiQuery({name: "goodsId", example: DEFAULT_GOODS_ID})
  @ApiQuery({name: "startDate", example: getLastDateStr()})
  @ApiQuery({name: "endDate", example: getLastDateStr()})
  private analyzeOrders(
    @Query('goodsId', ParseIntPipe) goodsId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.ordersService.analyzeOrders(goodsId, startDate, endDate)
  }

}
