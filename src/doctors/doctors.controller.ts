/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly usersSrevice: UsersService) {}
  @Get()
  async getAllDoctors(
    @Query() query: any,
  ): Promise<{ resalut: number; doctors: User[] }> {
    const doctors = await this.usersSrevice.getAllDoctors(
      query.specialization,
      query.query,
    );
    return { resalut: doctors.resalut, doctors: doctors.doctors };
  }
  @Get('/:id')
  async getDoctor(@Param() params: { id: string }): Promise<
    | {
        doctor: User;
      }
    | string
  > {
    const doctor = await this.usersSrevice.findOne(params.id);
    if (!doctor) {
      throw new HttpException('doctor not found with that id ', 404);
    }
    return {
      doctor: doctor,
    };
  }
}
