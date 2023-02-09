import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

const isPrismaDatabaseError = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'meta' in error &&
    'message' in error &&
    'clientVersion' in error
  );
};

export class PrismaErrorInterceptor implements NestInterceptor {
  private logger = new Logger(PrismaErrorInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (isPrismaDatabaseError(error)) {
          this.logger.error(error.message);
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
