import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/interfaces/user.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async loginIn(
    body: LoginDto,
    res: Response,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findByEmail(body.email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (user.active === false) {
      throw new UnauthorizedException(
        'User is inactive Please contact the administrator ',
      );
    }
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const existenUser = await this.usersService.findOne(user._id);
    const token = await this.jwtService.signAsync({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user: existenUser, token };
  }

  async signUp(
    user: User,
    res: Response,
  ): Promise<{ token: string; user: User }> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    user.role = 'patient';
    const token = await this.jwtService.signAsync({ email: user.email });

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      user: await this.usersService.signUp(user),
      token,
    };
  }

  async getMe(id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }
  async updateMe(id: string, user: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUser(id, user);
  }
  async deleteMe(id: string): Promise<{ message: string }> {
    return await this.usersService.deleteMe(id);
  }
}
