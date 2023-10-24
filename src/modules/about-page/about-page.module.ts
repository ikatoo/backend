import { Module } from '@nestjs/common';
import { DbModule } from 'src/infra/db/pg/db.module';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';

@Module({
  imports: [DbModule],
  controllers: [AboutPageController],
  providers: [AboutPageService],
})
export class AboutPageModule {}
