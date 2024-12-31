import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersSrevice: UsersService) {}
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersSrevice.findAll();
  }
}
