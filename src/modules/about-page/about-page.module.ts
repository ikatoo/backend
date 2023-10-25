import { Module } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';

@Module({
  controllers: [AboutPageController],
  providers: [AboutPageService, PgPromiseService],
})
export class AboutPageModule {}
