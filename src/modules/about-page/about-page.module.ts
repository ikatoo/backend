import { Module } from '@nestjs/common';
import { AboutPageService } from './about-page.service';
import { AboutPageController } from './about-page.controller';
import { PrismaService } from '../../infra/db/prisma/prisma.service';

@Module({
  controllers: [AboutPageController],
  providers: [AboutPageService, PrismaService],
})
export class AboutPageModule {}
