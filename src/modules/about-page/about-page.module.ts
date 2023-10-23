import { Module } from '@nestjs/common';
import { PgService } from 'src/infra/db/pg/pg.service';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';

@Module({
  controllers: [AboutPageController],
  providers: [AboutPageService, PgService],
})
export class AboutPageModule {}
