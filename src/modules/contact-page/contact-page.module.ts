import { Module } from '@nestjs/common';
import { ContactPageService } from './contact-page.service';
import { ContactPageController } from './contact-page.controller';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Module({
  controllers: [ContactPageController],
  providers: [ContactPageService, PrismaService],
})
export class ContactPageModule {}
