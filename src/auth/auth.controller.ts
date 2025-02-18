import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/interfaces/user.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/Role.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any): Promise<{ token: string; user: User }> {
    return await this.authService.loginIn(body.email, body.password);
  }
  @Post('signup')
  async signup(@Body() user: User) {
    return await this.authService.signUp(user);
  }

  @Post('forgot-password')
  async forgotPassword() {
    return { message: 'Password Reset Requested' };
  }
  @Post('reset-password')
  async resetPassword() {
    return { message: 'Password Reset' };
  }
  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Request() req): Promise<User> {
    return await this.authService.getMe(req.user.email);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Post('/create')
  async createNewUser(@Body() user: User): Promise<User> {
    return await this.authService.crateNewUser(user);
  }
}
