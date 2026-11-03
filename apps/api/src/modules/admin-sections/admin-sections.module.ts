import { Module } from "@nestjs/common";
import { AdminSectionsController } from "./admin-sections.controller";

@Module({
  controllers: [AdminSectionsController],
})
export class AdminSectionsModule {}
