import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ContactPageService } from './contact-page.service';
import { CreateContactPageDto } from './dto/create-contact-page.dto';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';

@Controller('contact')
export class ContactPageController {
  constructor(private readonly contactPageService: ContactPageService) {}

  @Post()
  create(@Body() createContactPageDto: CreateContactPageDto) {
    return this.contactPageService.create(createContactPageDto);
  }

  @Get('/user-id/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.contactPageService.findByUser(+userId);
  }

  @HttpCode(204)
  @Patch('/user-id/:userId')
  update(
    @Param('userId') userId: string,
    @Body() updateContactPageDto: UpdateContactPageDto,
  ) {
    return this.contactPageService.update(+userId, updateContactPageDto);
  }

  @HttpCode(204)
  @Delete('/user-id/:userId')
  remove(@Param('userId') userId: string) {
    return this.contactPageService.remove(+userId);
  }
}
