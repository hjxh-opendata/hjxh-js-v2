import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common"
import { DbService } from "./db.service"
import { ApiQuery, ApiTags } from "@nestjs/swagger"
import { COLL_NAMES } from "../const"

@ApiTags("Database")
@Controller("db")
export class DbController {
  constructor(private dbService: DbService) {
  }

  @Get('query')
  @ApiQuery({ name: "collName", enum: COLL_NAMES })
  @ApiQuery({ name: "skip", example: 0, type: Number })
  @ApiQuery({ name: "limit", example: 10, type: Number })
  query(
    @Query("collName") collName: string,
    @Query("skip", ParseIntPipe) skip: number,
    @Query("limit", ParseIntPipe) limit: number,
  ) {
    return this.dbService.query(collName, skip, limit)
  }
}
