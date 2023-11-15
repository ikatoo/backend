import { Module } from '@nestjs/common';
import { SkillsPageService } from './skills-page.service';
import { SkillsPageController } from './skills-page.controller';

@Module({
  controllers: [SkillsPageController],
  providers: [SkillsPageService],
})
export class SkillsPageModule {}
