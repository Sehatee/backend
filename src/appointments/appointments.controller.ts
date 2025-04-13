import {
  Body,
  Controller,
  HttpException,
  Post,
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
}
