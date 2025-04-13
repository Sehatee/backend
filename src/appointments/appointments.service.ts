/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Appointment } from './interfaces/appointment.interface';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UsersService } from 'src/users/users.service';
import * as moment from 'moment';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENTS_MODEL') private appointmentModel: Model<Appointment>,
    private usersService: UsersService,
  ) {}
  async createAppointment(body: CreateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentModel.create(body);
    const doctor = await this.usersService.findOne(body.doctorId);
    if (!doctor) throw new HttpException('Doctor not found', 404);

    if (doctor.role !== 'doctor')
      throw new HttpException('User is not a doctor', 403);
    const isAvailable = await this.isDoctorAvailable(body.doctorId, body.date);
    if (!isAvailable) {
      throw new HttpException('Doctor is not available on this Date', 403);
    }
    
    return appointment;
  }
  //check if the appointment is in true data
  async isDoctorAvailable(doctorId: string, date: string): Promise<boolean> {
    const doctor = await this.usersService.findOne(doctorId);

    if (!doctor) throw new HttpException('Doctor not found', 404);

    if (doctor.role !== 'doctor')
      throw new HttpException('User is not a doctor', 403);

    const dateMoment = moment(date).format('dddd');

    // ✅ التحقق مما إذا كان الطبيب يعمل في هذا اليوم
    const isWorking = doctor.availableHours.find(
      (slot) => slot.day === dateMoment,
    );

    if (!isWorking) {
      throw new HttpException(' Doctor not available on this day', 404);
    }
    return true;
  }
}
