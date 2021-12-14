import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "../users/module";
import { MongooseModule } from "@nestjs/mongoose";
import { DbModule } from "../db/db.module";
import { OrdersModule } from "../orders/orders.module";
import { MONGO_URI } from "../const";
import { AdModule } from "../ad/ad.module";
import { DownloadModule } from "../download/download.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "..", "public")
    }),
    MongooseModule.forRoot(MONGO_URI),
    DbModule,
    UsersModule,
    OrdersModule,
    AdModule,
    DownloadModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
