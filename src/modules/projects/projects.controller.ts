import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  listAll() {
    return this.projectsService.listAll();
  }

  @Get('/user-id/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.projectsService.findByUser(+userId);
  }

  @Get('/title/:partialTitle')
  findByTitle(@Param('partialTitle') partialTitle: string) {
    return this.projectsService.findByTitle(partialTitle);
  }
}
