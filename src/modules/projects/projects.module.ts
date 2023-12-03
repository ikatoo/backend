import { Module } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { SkillsService } from '../skills/skills.service';
import { ProjectController } from './project.controller';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController, ProjectController],
  providers: [ProjectsService, PgPromiseService, SkillsService],
})
export class ProjectsModule {}
