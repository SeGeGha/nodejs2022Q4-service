import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';
import { REQUEST } from '../constants';

const { LOGGER_LEVEL = 1 } = process.env;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LoggerService(Number(LOGGER_LEVEL));

  use(req: Request, res: Response, next: NextFunction): void {
    const { baseUrl, query, body } = req;

    res.on('finish', () => {
      const message =
        `URL: ${baseUrl}, ` +
        `Query parameters: ${JSON.stringify(query)}, ` +
        `Body: ${JSON.stringify(body)}, ` +
        `Status code: ${res.statusCode}`;

      this.logger.log(message, REQUEST);
    });

    next();
  }
}
