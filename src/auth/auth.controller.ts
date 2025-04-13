import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/interfaces/user.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/Role.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { LoginDto } from 'src/users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<{ token: string; user: User }> {
    return await this.authService.loginIn(body);
  }
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() user: User) {
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
  async me(@Request() req): Promise<User> {
    return await this.authService.getMe(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  async updateMe(@Body() user: UpdateUserDto, @Request() req): Promise<User> {
    return await this.authService.updateMe(req.user.id, user);
  }
  @UseGuards(AuthGuard)
  @Delete('/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@Request() req): Promise<{ message: string }> {
    return await this.authService.deleteMe(req.user.id);
  }
}
