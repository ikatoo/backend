import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { Email } from './entities/mailer.entity';
import { NodeMailerService } from './node-mailer/node-mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: NodeMailerService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post()
  send(@Body() email: Email) {
    return this.mailerService.send(email);
  }
}
