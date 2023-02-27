import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as CommonExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { LoggerService } from './logger.service';
import { getLogMessage } from '../utils/getLogMessage';
import { BASE_LOGGER_LEVELS, ERROR } from '../constants';

const { LOGGER_LEVEL = BASE_LOGGER_LEVELS.length } = process.env;

@Catch()
export class ExceptionFilter implements CommonExceptionFilter {
  private logger = new LoggerService(Number(LOGGER_LEVEL));

  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const httpArgumentsHost = host.switchToHttp();
    const req = httpArgumentsHost.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const res = isHttpException ? exception.getResponse() : {};
    const errorMessage =
      typeof res === 'object' ? (res as Record<string, string>).message : '';

    const url = httpAdapter.getRequestUrl(req);

    httpAdapter.reply(
      httpArgumentsHost.getResponse(),
      {
        statusCode: httpStatus,
        timestamp: new Date(),
        path: url,
        message: errorMessage,
      },
      httpStatus,
    );

    const message = getLogMessage(url, req.query, req.body, httpStatus);

    this.logger.error(message, ERROR);
  }
}
