import { Module } from "@nestjs/common";
import { AdminSubmissionsController } from "./admin-submissions.controller";

@Module({
  controllers: [AdminSubmissionsController],
})
export class AdminSubmissionsModule {}
