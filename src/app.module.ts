import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AboutPageModule } from './modules/about-page/about-page.module';
import { ContactPageModule } from './modules/contact-page/contact-page.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [UserModule, AboutPageModule, ContactPageModule, ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
