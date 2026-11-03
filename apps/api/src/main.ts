import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

loadEnv({ path: resolve(__dirname, "../../../.env") });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Manually configure body parsers so multipart/form-data (multer) requests
  // bypass JSON/urlencoded parsing, mirroring Next.js's per-request body handling.
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
  app.use(cookieParser());

  app.enableCors({
    origin: "http://localhost:7000",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  const port = Number(process.env.API_PORT) || 7001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}/api`);
}

bootstrap();
