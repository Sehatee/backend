import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/Role.guard';
import { Roles } from './decorators/Roles.decorator';
import { ResponseInterceptor } from './interceptors/res.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersSrevice: UsersService) {}
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async getAllUsers(): Promise<{ resalut: number; users: User[] }> {
    const users = await this.usersSrevice.findAll();
    return { resalut: users.users.length, users: users.users };
  }
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('/create')
  async createUser(@Body() user: User): Promise<User> {
    return await this.usersSrevice.createUser(user);
  }
  @Get('/:id')
  async getUser(@Param() id: string): Promise<User> {
    return await this.usersSrevice.findOne(id);
  }
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('/:id')
  async updateUser(
    @Param() params: { id: string },
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.usersSrevice.updateUser(params.id, user);
  }
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/:id')
  async deleteUser(@Param() params: { id: string }): Promise<void> {
    await this.usersSrevice.deleteUser(params.id);
  }
}
