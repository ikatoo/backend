import { Module } from '@nestjs/common';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';

@Module({
  imports: [
    NestPgpromiseModule.register({
      isGlobal: false,
      connection: config,
    }),
  ],
  controllers: [AboutPageController],
  providers: [AboutPageService],
})
export class AboutPageModule {}
