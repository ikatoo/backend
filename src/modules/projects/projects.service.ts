import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../../infra/db/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const { userId, ...project } = createProjectDto;
    await this.prisma.project.create({
      data: {
        ...project,
        lastUpdate: new Date(project.lastUpdate),
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async listAll() {
    return await this.prisma.project.findMany({
      include: {
        users: true,
      },
    });
  }

  async findByUser(userId: number) {
    return await this.prisma.project.findMany({
      where: { users: { some: { id: userId } } },
      include: {
        users: true,
      },
    });
  }

  async findByTitle(partialTitle: string) {
    return await this.prisma.project.findMany({
      where: {
        title: {
          contains: partialTitle,
        },
      },
      include: {
        users: true,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.project.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const { lastUpdate, title, description, githubLink, snapshot } =
      updateProjectDto;
    return await this.prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        githubLink,
        snapshot,
        lastUpdate: new Date(lastUpdate),
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.project.delete({ where: { id } });
  }
}
