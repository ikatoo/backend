import { Module } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

@Module({
  controllers: [ContactPageController],
  providers: [ContactPageService, PgPromiseService],
})
export class ContactPageModule {}
