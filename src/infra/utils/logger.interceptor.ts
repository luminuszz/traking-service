import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        tap((data) => {
          this.logger.log(data);
        }),
      )
      .pipe(
        catchError((err) => {
          this.logger.error(err);
          throw err;
        }),
      );
  }
}
