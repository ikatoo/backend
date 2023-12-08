import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContactPageService } from './contact-page.service';
import { CreateContactPageDto } from './dto/create-contact-page.dto';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';

@Controller('contact-page')
export class ContactPageController {
  constructor(private readonly contactPageService: ContactPageService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createContactPageDto: CreateContactPageDto) {
    this.contactPageService.create(createContactPageDto);
  }

  @Get('/user-id/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.contactPageService.findByUser(+userId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch()
  update(@Request() req, @Body() updateContactPageDto: UpdateContactPageDto) {
    const { id: userId } = req.user.sub;
    this.contactPageService.update(+userId, updateContactPageDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete()
  remove(@Request() req) {
    const { id: userId } = req.user.sub;
    this.contactPageService.remove(+userId);
  }
}
