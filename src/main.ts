import * as yaml from 'js-yaml';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './constants';

import('reflect-metadata');

const { PORT = DEFAULT_PORT, SWAGGER_YAML_PATH } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    const doc = await readFile(SWAGGER_YAML_PATH, {
      encoding: 'utf8',
    });
    SwaggerModule.setup('doc', app, yaml.load(doc));
  } catch (error) {
    console.error(error.message);
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT, () => {
    console.log(`🚀 Server started on port = ${PORT}`);
  });
}
bootstrap();
