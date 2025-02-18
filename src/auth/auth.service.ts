import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async loginIn(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
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
    const token = await this.jwtService.signAsync({ email: user.email });
    return {
      token,
      user: await this.usersService.signUp(user),
    };
  }

  async getMe(email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }
  async crateNewUser(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return await this.usersService.createUser(user);
  }
}
