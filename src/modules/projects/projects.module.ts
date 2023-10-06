import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { ProjectController } from './project.controller';

@Module({
  controllers: [ProjectsController, ProjectController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
