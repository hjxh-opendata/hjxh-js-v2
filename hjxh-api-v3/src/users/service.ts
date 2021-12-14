import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { COLL_GOODS_LIST, COLL_USERS, COLL_VERSION_PREFIX, DEFAULT_USER_ID } from "../const";
import { getCollName } from "../utils";

export interface Users extends Document {
  readonly username: string;
  readonly password: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectConnection() private connection: Connection) {}

  async query() {
    // users 暂时用v1的表
    return this.connection.collection(COLL_USERS).find().limit(10).toArray();
  }

  async queryGoodsListOfUser(userId: number) {
    // sku_list 太多了
    // const projection = [
    //   'cat_name',
    //   'cat_name_1',
    //   'cat_name_2',
    //   'cat_name_3',
    //   'cat_name_4',
    //   'goods_name',
    //   'thumb_url',
    //   'mallId',
    //   'market_price',
    //   'quantity',
    //   'sold_quantity',
    //   'sold_quantity_for_thirty_days',
    //   'userId',
    // ];
    const projection = {
      cat_name: 1,
      cat_name_1: 1,
      cat_name_2: 1,
      cat_name_3: 1,
      cat_name_4: 1,
      goods_name: 1,
      thumb_url: 1,
      mallId: 1,
      market_price: 1,
      quantity: 1,
      sold_quantity: 1,
      sold_quantity_for_thirty_days: 1,
      userId: 1
    }
    return this.connection
      .collection(getCollName(COLL_GOODS_LIST))
      .find({ userId }, { projection })
      .toArray();
  }
}
