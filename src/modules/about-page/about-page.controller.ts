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
  Request,
} from '@nestjs/common';
import { AboutPageService } from './about-page.service';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('about-page')
export class AboutPageController {
  constructor(private readonly aboutPageService: AboutPageService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createAboutPageDto: CreateAboutPageDto) {
    const { id: userId } = req.user.sub;
    return this.aboutPageService.create({ ...createAboutPageDto, userId });
  }

  @Get('user-id/:userId')
  async findByUser(@Param('userId') userId: string) {
    const page = await this.aboutPageService.findByUser(+userId);
    return page;
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch()
  update(@Request() req, @Body() updateAboutPageDto: UpdateAboutPageDto) {
    const { id: userId } = req.user.sub;
    return this.aboutPageService.update(+userId, updateAboutPageDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete()
  remove(@Request() req) {
    const { id: userId } = req.user.sub;
    return this.aboutPageService.remove(+userId);
  }
}
