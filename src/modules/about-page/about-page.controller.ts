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
import { AboutPageService } from './about-page.service';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';

@Controller('about')
export class AboutPageController {
  constructor(private readonly aboutPageService: AboutPageService) {}

  @Get()
  getPage() {
    return this.aboutPageService.getPage();
  }

  @Post()
  create(@Body() createAboutPageDto: CreateAboutPageDto) {
    return this.aboutPageService.create(createAboutPageDto);
  }

  @Get('user-id/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.aboutPageService.findByUser(+userId);
  }

  @HttpCode(204)
  @Patch('user-id/:userId')
  update(
    @Param('userId') userId: string,
    @Body() updateAboutPageDto: UpdateAboutPageDto,
  ) {
    return this.aboutPageService.update(+userId, updateAboutPageDto);
  }

  @HttpCode(204)
  @Delete('user-id/:userId')
  remove(@Param('userId') userId: string) {
    return this.aboutPageService.remove(+userId);
  }
}
