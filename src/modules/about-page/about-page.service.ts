import { Injectable } from '@nestjs/common';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class AboutPageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAboutPageDto: CreateAboutPageDto) {
    await this.prisma.aboutPage.create({ data: createAboutPageDto });
  }

  async findByUser(userId: number) {
    return await this.prisma.aboutPage.findUnique({ where: { userId } });
  }

  async update(userId: number, updateAboutPageDto: UpdateAboutPageDto) {
    await this.prisma.aboutPage.update({
      where: { userId },
      data: {
        ...updateAboutPageDto,
        userId,
      },
    });
  }

  async remove(userId: number) {
    await this.prisma.aboutPage.delete({ where: { userId } });
  }
}
