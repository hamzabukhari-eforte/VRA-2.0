import { Module } from "@nestjs/common";
import { CricketProxyController } from "./cricket-proxy.controller";

@Module({
  controllers: [CricketProxyController],
})
export class CricketProxyModule {}
