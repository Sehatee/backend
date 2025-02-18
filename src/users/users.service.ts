import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_MODEL') private userModel: Model<User>) {}

  async createUser(user: User): Promise<User> {
    if (user.role === 'doctor' && !user.specialization) {
      throw new HttpException('you must provide a special ', 404);
    }
    if (!user.location) {
      throw new HttpException('you must provide a Location ', 404);
    }
    if (!user.location.coordinates || user.location.coordinates.length < 2) {
      throw new HttpException('you must provide a coordinates ', 404);
    }

    return await this.userModel.create(user);
  }
  async signUp(user: User): Promise<User> {
    user.role = 'patient';
    if (user.role !== 'patient') {
      throw new HttpException('Invalid role', 400);
    }
    return await this.userModel.create(user);
  }
  async findAll(): Promise<{ resalut: number; users: User[] }> {
    const users = await this.userModel
      .find()
      .select('-password -confirmPassword');
    return { resalut: users.length, users };
  }
  async findOne(id: string): Promise<User> {
    return await this.userModel
      .findById(id)
      .select('-password -confirmPassword');
  }
  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    if (user.password) {
      throw new HttpException('this route not for update password', 401);
    }
    if (user.role === 'doctor' &&!user.specialization) {
      throw new HttpException('you must provide a special', 404);
    }
    return await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .select('-password -confirmPassword');
  }
  async deleteUser(id: string): Promise<void> {
    return await this.userModel.findByIdAndDelete(id);
  }
  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }
}
