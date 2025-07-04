import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/interfaces/user.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/Role.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFilesService } from 'src/upload-files/upload-files.service';
import { EmailsService } from 'src/emails/emails.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly uploadFilesService: UploadFilesService,
    private readonly emailsService: EmailsService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<{ token: string; user: User }> {
    return await this.authService.loginIn(body);
  }
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async signup(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|jpg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body()
    user: User,
  ) {
    user.picture = (await this.uploadFilesService.uploadFile(file)).secure_url;
    await this.emailsService.sendWelcomEmail(user.email, user.username);
    return await this.authService.signUp(user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword() {
    return { message: 'Password Reset Requested' };
  }
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword() {
    return { message: 'Password Reset' };
  }
  @UseGuards(AuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async me(@Request() req: any): Promise<{
    user: User;
  }> {
    return {
      user: await this.authService.getMe(req.user.id),
    };
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|jpg)$/ }),
        ],
        fileIsRequired: false, // Make file optional
      }),
    )
    file: Express.Multer.File,
    @Body() user: UpdateUserDto,
    @Request() req: any,
  ): Promise<User> {
    if (file) {
      user.picture = (
        await this.uploadFilesService.uploadFile(file)
      ).secure_url;
    }
    if (typeof user.location === 'string') {
      try {
        //@ts-expect-error : fix agine
        user.location = JSON.parse(user.location.trim());
      } catch (err) {
        throw new HttpException('invalid location format', 400);
      }
    }
    if (typeof user.availableHours === 'string') {
      try {
        //@ts-expect-error : fix agine
        user.availableHours = JSON.parse(user.availableHours.trim());
      } catch (err) {
        throw new HttpException('invalid availableHours format', 400);
      }
    }
    return await this.authService.updateMe(req.user.id, user);
  }
  @UseGuards(AuthGuard)
  @Delete('/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@Request() req): Promise<{ message: string }> {
    return await this.authService.deleteMe(req.user.id);
  }
  @UseGuards(AuthGuard)
  @Put('/me/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body()
    body: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ): Promise<{
    message: string;
    user: User;
  }> {
    return await this.authService.changePassword(body, req.user.id);
  }
}
