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
  create(@Body() createUserDto: User) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UserWithoutId) {
    const { id } = req.user.sub;
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete()
  remove(@Request() req) {
    const { id } = req.user.sub;
    return this.userService.remove(+id);
  }
}
