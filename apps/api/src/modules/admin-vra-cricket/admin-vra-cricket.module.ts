import { Module } from "@nestjs/common";
import { AdminVraCricketCarouselController } from "./carousel.controller";
import { AdminVraCricketCountsController } from "./counts.controller";

@Module({
  controllers: [AdminVraCricketCarouselController, AdminVraCricketCountsController],
})
export class AdminVraCricketModule {}
