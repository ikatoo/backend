import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get()
  findAll() {
    return this.skillsPageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsPageService.findByUser(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillsPageDto: UpdateSkillsPageDto) {
    return this.skillsPageService.update(+id, updateSkillsPageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsPageService.remove(+id);
  }
}
