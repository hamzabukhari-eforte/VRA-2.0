import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module";
import { AdminAuthModule } from "./modules/admin-auth/admin-auth.module";
import { AdminSectionsModule } from "./modules/admin-sections/admin-sections.module";
import { AdminHomepageModule } from "./modules/admin-homepage/admin-homepage.module";
import { AdminAboutModule } from "./modules/admin-about/admin-about.module";
import { AdminVraCricketModule } from "./modules/admin-vra-cricket/admin-vra-cricket.module";
import { AdminSubmissionsModule } from "./modules/admin-submissions/admin-submissions.module";
import { PublicAboutModule } from "./modules/public-about/public-about.module";
import { PublicCmsModule } from "./modules/public-cms/public-cms.module";
import { PublicHomepageModule } from "./modules/public-homepage/public-homepage.module";
import { CricketProxyModule } from "./modules/cricket-proxy/cricket-proxy.module";
import { AuthMemberModule } from "./modules/auth-member/auth-member.module";
import { MemberProfileModule } from "./modules/member-profile/member-profile.module";
import { SubmissionsModule } from "./modules/submissions/submissions.module";

@Module({
  imports: [
    CommonModule,
    AdminAuthModule,
    AdminSectionsModule,
    AdminHomepageModule,
    AdminAboutModule,
    AdminVraCricketModule,
    AdminSubmissionsModule,
    PublicAboutModule,
    PublicCmsModule,
    PublicHomepageModule,
    CricketProxyModule,
    AuthMemberModule,
    MemberProfileModule,
    SubmissionsModule,
  ],
})
export class AppModule {}
