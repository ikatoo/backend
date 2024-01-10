import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Email } from './entities/mailer.entity';
import { NodeMailerService } from './node-mailer/node-mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: NodeMailerService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  send(@Body() email: Email) {
    return this.mailerService.send(email);
  }
}
