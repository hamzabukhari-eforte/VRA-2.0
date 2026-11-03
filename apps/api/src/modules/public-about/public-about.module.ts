import { Module } from "@nestjs/common";
import { AboutBoardController } from "./about-board.controller";

@Module({
  controllers: [AboutBoardController],
})
export class PublicAboutModule {}
