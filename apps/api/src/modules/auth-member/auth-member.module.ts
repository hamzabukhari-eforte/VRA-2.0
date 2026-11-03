import { Module } from "@nestjs/common";
import { AuthMemberController } from "./auth-member.controller";

@Module({
  controllers: [AuthMemberController],
})
export class AuthMemberModule {}
