import * as dotenv from 'dotenv';
import * as yaml from 'js-yaml';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './constants';

dotenv.config();

const { PORT = DEFAULT_PORT, SWAGGER_YAML_PATH } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (SWAGGER_YAML_PATH) {
    const doc = await readFile(join(__dirname, SWAGGER_YAML_PATH), {
      encoding: 'utf8',
    });

    SwaggerModule.setup('doc', app, yaml.load(doc));
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT, () => {
    if (!SWAGGER_YAML_PATH) console.error('Missing SWAGGER_YAML_PATH in .env');
  });
}
bootstrap();
