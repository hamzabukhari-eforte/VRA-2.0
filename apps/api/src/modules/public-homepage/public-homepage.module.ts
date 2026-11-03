import { Module } from "@nestjs/common";
import { HomepageGalleryController } from "./homepage-gallery.controller";

@Module({
  controllers: [HomepageGalleryController],
})
export class PublicHomepageModule {}
