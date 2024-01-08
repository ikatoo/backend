import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AboutPageModule } from './modules/about-page/about-page.module';
import { ContactPageModule } from './modules/contact-page/contact-page.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PgPromiseService } from './infra/db/pg-promise/pg-promise.service';
import { SkillsModule } from './modules/skills/skills.module';
import { AuthModule } from './modules/auth/auth.module';
import { SkillsPageModule } from './modules/skills-page/skills-page.module';
import { ImageModule } from './modules/image/image.module';
import { NodeMailerService } from './infra/mailer/node-mailer/node-mailer.service';

@Module({
  imports: [
    UserModule,
    AboutPageModule,
    ContactPageModule,
    ProjectsModule,
    SkillsModule,
    AuthModule,
    SkillsPageModule,
    ImageModule,
  ],
  controllers: [],
  providers: [PgPromiseService, NodeMailerService],
})
export class AppModule {}
