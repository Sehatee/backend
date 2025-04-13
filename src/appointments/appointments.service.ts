/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Appointment } from './interfaces/appointment.interface';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UsersService } from 'src/users/users.service';
import * as moment from 'moment';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENTS_MODEL') private appointmentModel: Model<Appointment>,
    private usersService: UsersService,
  ) {}
  //finish
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
  //finish
  async updateAppointment(
    body: UpdateAppointmentDto,
    appointmentId: string,
    doctorId: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new HttpException('not found this appointment', 404);
    }
    if (!(appointment.doctorId.toString() === doctorId)) {
      throw new HttpException('this appointment not for you', 401);
    }
    const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
      appointmentId,
      body,
      { new: true },
    );

    return updatedAppointment;
  }
  //finish
  async deleteAppointment(
    appointmentId: string,
    doctorId: string,
  ): Promise<void> {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new HttpException('not found this appointment', 404);
    }
    if (!(appointment.doctorId.toString() === doctorId)) {
      throw new HttpException('this appointment not for you', 401);
    }
    await this.appointmentModel.findByIdAndDelete(appointmentId);
    return;
  }
  // Get one appointment By Doctor
  //finish
  async findOneAppointment(
    doctorId: string,
    appointmentId: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new HttpException('not found this appointment', 404);
    }
    if (!(appointment.doctorId.toString() === doctorId)) {
      throw new HttpException('this appointment not for you', 401);
    }
    return appointment;
  }
}
