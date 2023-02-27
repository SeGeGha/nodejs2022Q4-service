import * as yaml from 'js-yaml';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './constants';
import { LoggerService } from './logger/logger.service';

import('reflect-metadata');

const {
  PORT = DEFAULT_PORT,
  SWAGGER_YAML_PATH,
  LOGGER_LEVELS = '',
} = process.env;
const LOGGER_LEVELS_LIST = LOGGER_LEVELS.split(',');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  try {
    const doc = await readFile(SWAGGER_YAML_PATH, {
      encoding: 'utf8',
    });
    SwaggerModule.setup('doc', app, yaml.load(doc));
  } catch (error) {
    console.error(error.message);
  }

  app.useLogger(new LoggerService(LOGGER_LEVELS_LIST));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT, () => {
    console.log(`🚀 Server started on port = ${PORT}`);
  });
}
bootstrap();
