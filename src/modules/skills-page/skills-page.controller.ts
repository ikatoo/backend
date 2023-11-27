import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SkillsPageService } from './skills-page.service';
import { CreateSkillsPageDto } from './dto/create-skills-page.dto';
import { UpdateSkillsPageDto } from './dto/update-skills-page.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('skills-page')
export class SkillsPageController {
  constructor(private readonly skillsPageService: SkillsPageService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createSkillsPageDto: CreateSkillsPageDto) {
    const { id: userId } = req.user.sub;
    return this.skillsPageService.create({ ...createSkillsPageDto, userId });
  }

  @Get('user-id/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.skillsPageService.findByUser(+userId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch()
  update(@Request() req, @Body() updateSkillsPageDto: UpdateSkillsPageDto) {
    const { id: userId } = req.user.sub;
    return this.skillsPageService.update(+userId, updateSkillsPageDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    const { id: userId } = req.user.sub;
    return this.skillsPageService.remove(+userId);
  }
}
