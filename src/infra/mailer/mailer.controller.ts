import { Body, Controller, Post } from '@nestjs/common';
import { Email } from './entities/mailer.entity';
import { NodeMailerService } from './node-mailer/node-mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: NodeMailerService) {}

  @Post()
  send(@Body() email: Email) {
    return this.mailerService.send(email);
  }
}
