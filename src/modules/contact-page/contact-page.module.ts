import { Module } from '@nestjs/common';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

@Module({
  imports: [
    NestPgpromiseModule.register({
      isGlobal: false,
      connection: config,
    }),
  ],
  controllers: [ContactPageController],
  providers: [ContactPageService],
})
export class ContactPageModule {}
