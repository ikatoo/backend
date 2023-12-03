import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SkillsService } from '../skills/skills.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

type Skill = { title: string };

type Project = CreateProjectDto & { userId: number; skills: Skill[] };

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly skillsService: SkillsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createProjectDto: Project) {
    const { title, description, snapshot, repositoryLink, start, lastUpdate } =
      createProjectDto;

    const { id: projectId } = await this.projectsService.create({
      title,
      description,
      snapshot,
      repositoryLink,
      start,
      lastUpdate,
    });

    const projectOnUser = await this.projectsService.createOnUser(
      projectId,
      createProjectDto.userId,
    );

    createProjectDto.skills.forEach(async (skill) => {
      const existSkill = await this.skillsService.findByTitle(skill.title);
      if (!!existSkill) {
        await this.skillsService.createOnProject(
          existSkill.id,
          projectOnUser.id,
        );
        return;
      }
      const { id: skillId } = await this.skillsService.create({
        title: skill.title,
      });
      await this.skillsService.createOnProject(skillId, projectOnUser.id);
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
