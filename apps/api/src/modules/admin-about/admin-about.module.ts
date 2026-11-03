import { Module } from "@nestjs/common";
import { AdminAboutBoardController } from "./board.controller";

@Module({
  controllers: [AdminAboutBoardController],
})
export class AdminAboutModule {}
