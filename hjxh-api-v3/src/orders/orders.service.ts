import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Order, OrderDocument } from "./orders.schema"
import { Model } from "mongoose"
import { EXCLUDE_ORDER_STATUS_LIST } from "../const"

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {
  }

  async analyzeOrders(goodsId: number, startDate: string, endDate: string) {
    return this.orderModel.aggregate([
      {
        $match: {
          goods_id: goodsId,
          $and: [{ targetDate: { $gte: startDate } }, { targetDate: { $lte: endDate } }],
          order_status_str: { $not: { $in: EXCLUDE_ORDER_STATUS_LIST } },
        },
      },
      {
        $group: {
          _id: {
            date: "$targetDate",
            spec: "$spec",
          },
          goods_number: {
            $sum: "$goods_number",
          },
          goods_amount: {
            $sum: "$goods_amount",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                date: "$_id.date",
                spec: "$_id.spec",
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
  }
}
