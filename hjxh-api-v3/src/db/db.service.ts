import { Injectable } from "@nestjs/common"
import { InjectConnection } from "@nestjs/mongoose"
import { Connection } from "mongoose"

@Injectable()
export class DbService {
  constructor(@InjectConnection() private connection: Connection) {
  }

  async query(collName: string, skip: number, limit: number) {
    console.log({collName});
    const cursor = this.connection.collection(collName).find()
    return {
      total: await cursor.count(),
      items: await cursor.skip(skip).limit(limit).toArray(),
    }
  }
}
