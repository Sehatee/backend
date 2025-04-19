import { Connection } from 'mongoose';
import { medicalRecordSchema } from 'src/database/schemas/medicalRecord.schema';

export const medicalProviders = [
  {
    provide: 'MEDICAL_RECORDS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('MedicalRecord', medicalRecordSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
