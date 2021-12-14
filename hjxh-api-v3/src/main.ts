import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { TransformResponseInterceptor } from "./core/interceptors/transform.interceptor";
import { HttpExceptionFilter } from "./core/filters/exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { API_VERSION } from "./const";
// const PROJECT_PATH = path.join(__dirname, "..");
// const VERSION_PATH = path.join(PROJECT_PATH, "../VERSION.txt");
// const version = fs.readFileSync(VERSION_PATH, "utf-8");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // https://docs.nestjs.com/faq/global-prefix , 得在`swagger`之前
  app.setGlobalPrefix(API_VERSION);

  app.enableCors(
    {
      origin: [
        "http://localhost:3000",
        "http://nanchuan.site:3000",
        "https://nanchuan.site:3000"
      ], credentials: true
    }
  );

  const config = new DocumentBuilder()
    .setTitle("皇家小虎数据中台API系统")
    .setDescription("2021年05月15日")
    // .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // https://docs.nestjs.com/techniques/validation#auto-validation
  app.useGlobalPipes(new ValidationPipe());

  // NestJs返回统一的数据格式 | afacode的博客 | 人懒，偶尔记录 - https://blog.afacode.top/2020/02/09/nestjs-response-format/
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());


  // https://gist.github.com/cvan/ef28f73b88b991d4a9705314b2af2e78
  const HOST = require("os").type() === "Darwin" ? "localhost" : "0.0.0.0";
  await app.listen(8000, HOST);
}

bootstrap();
