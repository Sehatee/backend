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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async loginIn(body: LoginDto): Promise<{ token: string; user: User }> {
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
    const existenUser = await this.usersService.findOne(user._id); // for not show password or confirmPassword
    const token = await this.jwtService.signAsync({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    return { token, user: existenUser };
  }
  async signUp(user: User): Promise<{
    token: string;
    user: User; // دور المستخدم عادي
  }> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    user.role = 'patient';
    const token = await this.jwtService.signAsync({ email: user.email });
    const newUser = await this.usersService.signUp(user);
    return {
      token,
      user: newUser,
    };
  }

  async getMe(id: string): Promise<User> {
    return await this.usersService.findOne(id); // TODO: handle how to add show the current use has loggdin
  }
  async updateMe(id: string, user: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUser(id, user);
  }
  async deleteMe(id: string): Promise<{ message: string }> {
    return await this.usersService.deleteMe(id);
  }
  async changePassword(
    body: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    userId: string,
  ): Promise<{
    user: User;
    message: string;
  }> {
    const user = await this.usersService.getUserPassword(userId);

    const isPasswordValid = await bcrypt.compare(
      body.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    if (body.newPassword !== body.confirmPassword) {
      throw new HttpException('Passwords do not match', 400);
    }
    const newHashedPassword = await bcrypt.hash(body.newPassword, 10);

    return {
      user: await this.usersService.changeUserPassword(
        user._id,
        newHashedPassword,
      ),
      message: 'Password changed successfully',
    };
  }
}
