// interceptors/add-doctor-id.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AddPatientIdAndDoctorIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.user && request.user.id) {
      request.body.patientId = request.user.id;
      request.body.doctorId = request.params.doctorId;
    }

    return next.handle();
  }
}
