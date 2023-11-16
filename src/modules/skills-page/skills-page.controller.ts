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
import { SkillsPageService } from './skills-page.service';
import { CreateSkillsPageDto } from './dto/create-skills-page.dto';
import { UpdateSkillsPageDto } from './dto/update-skills-page.dto';

@Controller('skills-page')
export class SkillsPageController {
  constructor(private readonly skillsPageService: SkillsPageService) {}

  @Post()
  create(@Body() createSkillsPageDto: CreateSkillsPageDto) {
    return this.skillsPageService.create(createSkillsPageDto);
  }

  @Get('user-id/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.skillsPageService.findByUser(+userId);
  }

  @HttpCode(204)
  @Patch('user-id/:userId')
  update(
    @Param('userId') userId: string,
    @Body() updateSkillsPageDto: UpdateSkillsPageDto,
  ) {
    return this.skillsPageService.update(+userId, updateSkillsPageDto);
  }

  @Delete('user-id/:userId')
  remove(@Param('userId') userId: string) {
    return this.skillsPageService.remove(+userId);
  }
}
