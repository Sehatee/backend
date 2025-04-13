import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return await this.userModel.create(user);
  }
  async signUp(user: User): Promise<User> {
    // user.role = 'patient';
    // if (user.role !== 'patient') {
    //   throw new HttpException('Invalid role', 400);
    // } // إنزع التعليق في حالة الProd
    return await this.userModel.create(user);
  }
  async findAll(query?: any): Promise<{ resalut: number; users: User[] }> {
    const { filter, sort, limit, fields } = query;
    // add filtering
    let filterObj = {};
    if (filter) {
      filterObj = JSON.parse(
        filter.replace(
          /\b(gt|gte|lt|lte|ne|in|nin)\b/g,
          (match) => `$${match}`,
        ),
      );
    }
    //add sorting
    let sortObj = {};
    if (sort) {
      sortObj = sort.split(',').join(' '); // تحويل `age,-username` إلى `age -username`
    }
    let fieldsObj = {};
    if (fields) {
      fieldsObj = fields.split(',').join(' '); // `username,email` إلى `username email`
    }
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    const users = await this.userModel
      .find(filterObj)
      .sort(sortObj)
      .select(fieldsObj)
      .limit(resultLimit)
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
    if (user.role === 'doctor' && !user.specialization) {
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

  //change user.active to false

  async deleteMe(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    user.active = false;
    await user.save({
      validateBeforeSave: false,
    });
    return {
      message: 'User deleted successfully',
    };
  }

  // this only for doctor users
  async updateDoctorAppointment(id: string, doctor: User): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, doctor, { new: true });
  }
}
