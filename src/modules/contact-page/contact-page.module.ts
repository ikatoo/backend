import { Module } from '@nestjs/common';
import { DbModule } from 'src/infra/db/pg/db.module';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

@Module({
  imports: [DbModule],
  controllers: [ContactPageController],
  providers: [ContactPageService],
})
export class ContactPageModule {}
