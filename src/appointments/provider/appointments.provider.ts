import { Connection } from 'mongoose';
import { appointmentSchema } from 'src/database/schemas/appointment.schema';

export const appointmentsProviders = [
  {
    provide: 'APPOINTMENTS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Appointment', appointmentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
