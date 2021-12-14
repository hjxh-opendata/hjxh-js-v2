import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderDocument = Order & Document

// refer: javascript - MongoDB and Nest.js: Define a custom name for a collection - Stack Overflow - https://stackoverflow.com/questions/63234815/mongodb-and-nest-js-define-a-custom-name-for-a-collection
@Schema({collection: "V2_orders"})
export class Order {
  @Prop()
  goods_id: number

  @Prop()
  targetDate: string

  @Prop()
  order_time: number

  @Prop()
  order_status_str: string

  @Prop()
  spec: string

  @Prop()
  goods_number: number

  @Prop()
  goods_amount: number
}


export const OrderSchema = SchemaFactory.createForClass(Order)
