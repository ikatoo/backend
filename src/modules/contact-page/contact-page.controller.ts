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
  async create(
    @Request() req,
    @Body() createContactPageDto: CreateContactPageDto,
  ) {
    const { id: userId } = req.user.sub;
    await this.contactPageService.create({
      userId,
      ...createContactPageDto,
    });
  }

  @Get('/user-id/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.contactPageService.findByUser(+userId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch()
  async update(
    @Request() req,
    @Body() updateContactPageDto: UpdateContactPageDto,
  ) {
    const { id: userId } = req.user.sub;
    await this.contactPageService.update(+userId, updateContactPageDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete()
  async remove(@Request() req) {
    const { id: userId } = req.user.sub;
    await this.contactPageService.remove(+userId);
  }
}
