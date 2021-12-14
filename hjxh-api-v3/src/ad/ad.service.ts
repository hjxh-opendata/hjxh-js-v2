import { Injectable } from "@nestjs/common"
import { InjectConnection } from "@nestjs/mongoose"
import { Connection } from "mongoose"
import { getCollName } from "../utils"
import { COLL_AD_FANGXIN, COLL_AD_SCENE, COLL_AD_SEARCH } from "../const"

@Injectable()
export class AdService {
  constructor(@InjectConnection() private connection: Connection) {
  }

  async analyzeSpecificAd(collName: string, goodsId: number, startDate: string, endDate: string) {
    return this.connection
      .collection(getCollName(collName))
      .aggregate([
        {
          $match: {
            goodsId: goodsId,
            $and: [{ targetDate: { $gte: startDate } }, { targetDate: { $lte: endDate } }],
          },
        },
        {
          $group: {
            _id: "$targetDate",
            click: { $sum: "$click" }, // 点击量
            impression: { $sum: "$impression" }, // 曝光量
            orderNum: { $sum: "$orderNum" }, // 成交笔数
            gmv: { $sum: "$gmv" }, // 交易额
            spend: { $sum: "$spend" }, // 花费
          },
        },
        {
          $addFields: {
            date: "$_id",
            _ctr: {
              // 点击率 = 点击量 / 曝光量
              $cond: [{ $eq: ["$impression", 0] }, 0, { $divide: ["$click", "$impression"] }],
            },
            _cvr: {
              // 转化率 = 成交笔数 / 点击量
              // "$divide": ['$orderNum', "$click"]
              $cond: [{ $eq: ["$click", 0] }, 0, { $divide: ["$orderNum", "$click"] }],
            },
            _roi: {
              // 投产 = 交易额 / 花费
              // '$divide': ['$gmv', '$spend']
              $cond: [{ $eq: ["$spend", 0] }, 0, { $divide: ["$gmv", "$spend"] }],
            },
          },
        },

        {
          $project: {
            _id: 0,
          },
        }
      ])
      .toArray()
  }

  async analyzeAd(goodsId: number, startDate: string, endDate: string) {
    return {
      ad_search: await this.analyzeSpecificAd(COLL_AD_SEARCH, goodsId, startDate, endDate),
      ad_scene: await this.analyzeSpecificAd(COLL_AD_SCENE, goodsId, startDate, endDate),
      ad_fangxin: await this.analyzeSpecificAd(COLL_AD_FANGXIN, goodsId, startDate, endDate),
    }
  }
}
