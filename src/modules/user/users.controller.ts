import { Controller, Get } from '@nestjs/common';
import { UsersServicePrisma } from 'src/infra/db/prisma/users/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersServicePrisma) {}

  @Get()
  listAll() {
    return this.userService.listAll();
  }
}
