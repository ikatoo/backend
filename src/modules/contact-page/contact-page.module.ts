import { Module } from '@nestjs/common';
import { PgService } from 'src/infra/db/pg/pg.service';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

@Module({
  controllers: [ContactPageController],
  providers: [ContactPageService, PgService],
})
export class ContactPageModule {}
