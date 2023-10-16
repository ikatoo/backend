import { Controller, Get } from '@nestjs/common';
import { UserServicePrisma } from 'src/infra/db/prisma/user/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserServicePrisma) {}

  @Get()
  listAll() {
    return this.userService.listAll();
  }
}
