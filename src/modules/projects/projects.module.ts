import { Module } from '@nestjs/common';
import { DbModule } from 'src/infra/db/pg/db.module';
import { ProjectController } from './project.controller';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [DbModule],
  controllers: [ProjectsController, ProjectController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
