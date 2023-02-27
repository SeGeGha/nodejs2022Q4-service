import {
  Injectable,
  LoggerService as CommonLoggerService,
} from '@nestjs/common';
import { COLORS, LOGGER_LEVELS } from 'src/constants';

const loggerLevelList = [
  LOGGER_LEVELS.LOG,
  LOGGER_LEVELS.DEBUG,
  LOGGER_LEVELS.ERROR,
  LOGGER_LEVELS.VERBOSE,
  LOGGER_LEVELS.WARN,
];

@Injectable()
export class LoggerService implements CommonLoggerService {
  private loggerLevels: string[];

  constructor(loggerLevel: number) {
    this.loggerLevels = loggerLevelList.slice(0, loggerLevel);
  }

  log(message: string, ...optionalParams: any[]) {
    if (!this.loggerLevels.includes(LOGGER_LEVELS.LOG)) return;

    console.log(COLORS.WHITE, optionalParams, COLORS.GREEN, message);
  }

  error(message: string, ...optionalParams: any[]) {
    if (!this.loggerLevels.includes(LOGGER_LEVELS.ERROR)) return;

    console.log(COLORS.WHITE, optionalParams, COLORS.RED, message);
  }

  warn(message: string, ...optionalParams: any[]) {
    if (!this.loggerLevels.includes(LOGGER_LEVELS.WARN)) return;

    console.log(COLORS.WHITE, optionalParams, COLORS.YELLOW, message);
  }

  debug(message: string, ...optionalParams: any[]) {
    if (!this.loggerLevels.includes(LOGGER_LEVELS.DEBUG)) return;

    console.log(COLORS.WHITE, optionalParams, message);
  }

  verbose(message: string, ...optionalParams: any[]) {
    if (!this.loggerLevels.includes(LOGGER_LEVELS.VERBOSE)) return;

    console.log(COLORS.WHITE, optionalParams, COLORS.BLUE, message);
  }
}
