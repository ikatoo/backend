import { Module } from '@nestjs/common';
import { PgService } from 'src/infra/db/pg/pg.service';
import { ProjectController } from './project.controller';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController, ProjectController],
  providers: [ProjectsService, PgService],
})
export class ProjectsModule {}
