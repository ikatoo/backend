import { Module } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { SkillsPageController } from './skills-page.controller';
import { SkillsPageService } from './skills-page.service';

@Module({
  controllers: [SkillsPageController],
  providers: [SkillsPageService, PgPromiseService],
})
export class SkillsPageModule {}
