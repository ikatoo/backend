import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User, UserWithoutId } from './IUserService';
import { UsersService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: User) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch()
  async update(@Request() req, @Body() updateUserDto: UserWithoutId) {
    const { id } = req.user.sub;
    return await this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete()
  async remove(@Request() req) {
    const { id } = req.user.sub;
    return await this.userService.remove(+id);
  }
}
