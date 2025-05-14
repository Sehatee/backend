/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly usersSrevice: UsersService) {}
  @Get()
  async getAllDoctors(
    @Query() query: any,
  ): Promise<{ resalut: number; doctors: User[] }> {
    
    const doctors = await this.usersSrevice.getAllDoctors(query.specialization);
    return { resalut: doctors.resalut, doctors: doctors.doctors };
  }
}
