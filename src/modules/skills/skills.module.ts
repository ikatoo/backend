import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService, PgPromiseService],
})
export class SkillsModule {}
