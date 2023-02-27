import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';
import { getLogMessage } from '../utils/getLogMessage';
import { BASE_LOGGER_LEVELS, REQUEST } from '../constants';

const { LOGGER_LEVEL = BASE_LOGGER_LEVELS.length } = process.env;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LoggerService(Number(LOGGER_LEVEL));

  use(req: Request, res: Response, next: NextFunction): void {
    const { baseUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const message = getLogMessage(baseUrl, query, body, statusCode);

      if (statusCode < HttpStatus.BAD_REQUEST) {
        this.logger.log(message, REQUEST);
      }
    });

    next();
  }
}
