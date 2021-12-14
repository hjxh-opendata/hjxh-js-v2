import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { display } from '../../utils';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map((data: any) => {
        console.log({ statusCode, _data: display(data) });
        return {
          result: Array.isArray(data)
            ? { items: data, length: data.length }
            : data,
          success: true,
          message: '请求成功',
        };
      }),
    );
  }
}
