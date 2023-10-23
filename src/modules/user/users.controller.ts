import { Controller, Get } from '@nestjs/common';
import { UsersServicePg } from 'src/infra/db/pg/user/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersServicePg) {}

  @Get()
  listAll() {
    return this.userService.listAll();
  }
}
