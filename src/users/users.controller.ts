import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
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
  async getAllUsers(
    @Query() query: any,
  ): Promise<{ resalut: number; users: User[] }> {
    const users = await this.usersSrevice.findAll(query);
    return { resalut: users.users.length, users: users.users };
  }
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('/create')
  async createUser(@Body() user: User): Promise<User> {
    return await this.usersSrevice.createUser(user);
  }
  @Get('/:id')
  async getUser(@Param() params: { id: string }): Promise<User | string> {
    const user = await this.usersSrevice.findOne(params.id);
    if (!user) {
      throw new HttpException('User not found with that id ', 404);
    }
    return user;
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
    const user = await this.usersSrevice.findOne(params.id);
    if (!user) {
      throw new HttpException('User not found with that id ', 404);
    }
    await this.usersSrevice.deleteUser(params.id);
  }
}
