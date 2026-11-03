import { Module } from "@nestjs/common";
import { MemberProfileController } from "./member-profile.controller";

@Module({
  controllers: [MemberProfileController],
})
export class MemberProfileModule {}
