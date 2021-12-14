import { Module } from '@nestjs/common';
import { DbController } from "./db.controller";
import { DbService } from "./db.service";

@Module({
  controllers: [DbController],
  providers: [DbService]
})

export class DbModule {}
