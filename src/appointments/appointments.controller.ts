import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './interfaces/appointment.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/Role.guard';
import { Roles } from 'src/users/decorators/Roles.decorator';
import { ResponseInterceptorAppointments } from './interceptors/res.interceptor';
import { query } from 'express';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
@UseInterceptors(ResponseInterceptorAppointments)
@UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}
  @Post()
  @UseGuards(RolesGuard)
  @Roles('patient')
  async createAppointment(
    @Body() body: CreateAppointmentDto,
    @Request() req: any,
  ): Promise<Appointment> {
    body.patientId = req.user.id;
    body.status = 'pending';

    return await this.appointmentsService.createAppointment(body);
  }
  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async getOneAppointment(
    @Param() params: { id: string },
    @Request() req: any,
  ): Promise<Appointment> {
    const doctorId = req.user.id;
    return await this.appointmentsService.findOneAppointment(
      doctorId,
      params.id,
    );
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async getAllAppointmentsByDoctor(@Request() req: any): Promise<{
    total: number;
    appointments: Appointment[];
  }> {
    const id = req.user.id;
    return {
      total: (await this.appointmentsService.getAllAppointmentsByDoctor(id))
        .length,
      appointments:
        await this.appointmentsService.getAllAppointmentsByDoctor(id),
    };
  }
  @Patch('/:id')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async updateAppointment(
    @Param()
    params: {
      id: string;
    },
    @Request() req: any,
    @Body() body: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const doctorId = req.user.id;
    return this.appointmentsService.updateAppointment(
      body,
      params.id,
      doctorId,
    );
  }
  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async deleteAppointment(
    @Param()
    params: {
      id: string;
    },
    @Request() req: any,
  ): Promise<void> {
    const doctorId = req.user.id;
    return this.appointmentsService.deleteAppointment(params.id, doctorId);
  }
}
