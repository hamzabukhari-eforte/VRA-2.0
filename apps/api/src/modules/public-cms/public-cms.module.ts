import { Module } from "@nestjs/common";
import { CmsSectionController } from "./cms-section.controller";

@Module({
  controllers: [CmsSectionController],
})
export class PublicCmsModule {}
