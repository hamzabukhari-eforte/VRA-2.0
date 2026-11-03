import { Module } from "@nestjs/common";
import { AdminHomepageGalleryController } from "./gallery.controller";
import { AdminHomepageCrowdController } from "./crowd.controller";
import { AdminHomepageTeamsController } from "./teams.controller";
import { AdminHomepageSponsorsController } from "./sponsors.controller";

@Module({
  controllers: [
    AdminHomepageGalleryController,
    AdminHomepageCrowdController,
    AdminHomepageTeamsController,
    AdminHomepageSponsorsController,
  ],
})
export class AdminHomepageModule {}
