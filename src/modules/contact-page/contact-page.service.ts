import { Injectable } from '@nestjs/common';
import { CreateContactPageDto } from './dto/create-contact-page.dto';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';
import { PrismaService } from '../../infra/db/prisma/prisma.service';

@Injectable()
export class ContactPageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactPageDto: CreateContactPageDto) {
    await this.prisma.contactPage.create({ data: createContactPageDto });
  }

  async findByUser(userId: number) {
    return await this.prisma.contactPage.findUnique({ where: { userId } });
  }

  async update(userId: number, updateContactPageDto: UpdateContactPageDto) {
    return await this.prisma.contactPage.update({
      where: { userId },
      data: {
        ...updateContactPageDto,
        userId,
      },
    });
  }

  async remove(userId: number) {
    return await this.prisma.contactPage.delete({ where: { userId } });
  }
}
