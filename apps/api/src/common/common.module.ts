import { Global, Module } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth/admin-auth.service";
import { MemberAuthService } from "./member-auth/member-auth.service";
import { MailService } from "./mail/mail.service";
import { StorageService } from "./storage/storage.service";
import { ApiUtilsService } from "./api-utils/api-utils.service";
import { MembershipService } from "./membership/membership.service";

/**
 * Global module exposing shared services (ported from apps/web/lib/*) to all
 * feature modules without needing to re-import them everywhere.
 */
@Global()
@Module({
  providers: [
    AdminAuthService,
    MemberAuthService,
    MailService,
    StorageService,
    ApiUtilsService,
    MembershipService,
  ],
  exports: [
    AdminAuthService,
    MemberAuthService,
    MailService,
    StorageService,
    ApiUtilsService,
    MembershipService,
  ],
})
export class CommonModule {}
