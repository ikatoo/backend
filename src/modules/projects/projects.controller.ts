import { Controller, Get, Param } from '@nestjs/common';
import { SkillsService } from '../skills/skills.service';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly skillsService: SkillsService,
  ) {}

  @Get()
  listAll() {
    return this.projectsService.listAll();
  }

  @Get('/user-id/:userId')
  async findByUser(@Param('userId') userId: string) {
    const projects = await this.projectsService.findByUser(+userId);
    const projectsWithSkills = await Promise.all(
      projects.map(async (project) => {
        const skills = await this.skillsService.findByUserProject(
          +userId,
          project.id,
        );

        return {
          userId: +userId,
          ...project,
          skills,
        };
      }),
    );

    return projectsWithSkills;
  }
}
