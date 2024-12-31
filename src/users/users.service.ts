import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_MODEL') private userModel: Model<User>) {}

  async createUser(user: User): Promise<User> {
    return await this.userModel.create(user);
  }
  async findAll(): Promise<User[]> {
    return await this.userModel.find().select('-password');
  }
  async findOne(id: number): Promise<User> {
    return await this.userModel.findById(id).select('-password');
  }
  async updateUser(id: number, user: User): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .select('-password');
  }
  async deleteUser(id: number): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
