import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';

@Module({
  imports: [
    NestPgpromiseModule.register({
      isGlobal: false,
      connection: config,
    }),
  ],
  controllers: [ProjectsController, ProjectController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
