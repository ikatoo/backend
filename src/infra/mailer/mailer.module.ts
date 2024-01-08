import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { NodeMailerService } from './node-mailer/node-mailer.service';

@Module({
  controllers: [MailerController],
  providers: [NodeMailerService],
})
export class MailerModule {}
