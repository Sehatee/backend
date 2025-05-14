import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { createUserDto } from './dto/create-user.dto';
import { UploadFilesService } from 'src/upload-files/upload-files.service';

@Controller('users')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private usersSrevice: UsersService,
    private readonly uploadFilesService: UploadFilesService,
  ) {}
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
  @UseInterceptors(FileInterceptor('file'))
  @Roles('admin')
  @Post('/create')
  async createUser(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|jpg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() user: User,
  ): Promise<User> {
    user.picture = (await this.uploadFilesService.uploadFile(file)).secure_url;
    user.active = true;
    if (typeof user.location === 'string') {
      try {
        //@ts-expect-error : fix agine
        user.location = JSON.parse(user.location.trim());
      } catch (err) {
        throw new HttpException('invalid location format', 400);
      }
    }
    console.log('pricture', user.picture);
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
