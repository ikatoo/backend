import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AboutPageService } from './about-page.service';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('about')
export class AboutPageController {
  constructor(private readonly aboutPageService: AboutPageService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAboutPageDto: CreateAboutPageDto) {
    return this.aboutPageService.create(createAboutPageDto);
  }

  @Get('user-id/:userId')
  async findByUser(@Param('userId') userId: string) {
    const page = await this.aboutPageService.findByUser(+userId);
    return page;
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch('user-id/:userId')
  update(
    @Param('userId') userId: string,
    @Body() updateAboutPageDto: UpdateAboutPageDto,
  ) {
    return this.aboutPageService.update(+userId, updateAboutPageDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('user-id/:userId')
  remove(@Param('userId') userId: string) {
    return this.aboutPageService.remove(+userId);
  }
}
