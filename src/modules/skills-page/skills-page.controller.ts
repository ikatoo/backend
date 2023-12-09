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
import { CreateSkillsPageDto } from './dto/create-skills-page.dto';
import { UpdateSkillsPageDto } from './dto/update-skills-page.dto';
import { SkillsPageService } from './skills-page.service';

@Controller('skills-page')
export class SkillsPageController {
  constructor(private readonly skillsPageService: SkillsPageService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createSkillsPageDto: CreateSkillsPageDto,
  ) {
    const { id: user_id } = req.user.sub;
    return await this.skillsPageService.create({
      ...createSkillsPageDto,
      user_id,
    });
  }

  @Get('user-id/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.skillsPageService.findByUser(+userId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch()
  async update(
    @Request() req,
    @Body() updateSkillsPageDto: UpdateSkillsPageDto,
  ) {
    const { id: userId } = req.user.sub;
    return await this.skillsPageService.update(+userId, updateSkillsPageDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete()
  async remove(@Request() req) {
    const { id: userId } = req.user.sub;
    return await this.skillsPageService.remove(+userId);
  }
}
