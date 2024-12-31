import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post()
  async login() {
    return { message: 'Logged In' };
  }
  @Post('register')
  async register() {
    return { message: 'Registered' };
  }
  @Post('logout')
  async logout() {
    return { message: 'Logged Out' };
  }
  @Post('forgot-password')
  async forgotPassword() {
    return { message: 'Password Reset Requested' };
  }
  @Post('reset-password')
  async resetPassword() {
    return { message: 'Password Reset' };
  }
}
