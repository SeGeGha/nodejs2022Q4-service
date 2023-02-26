import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions = {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  entities: [process.env.TYPEORM_ENTITIES],
  logging: process.env.TYPEORM_LOGGING === 'true',
  migrations: [process.env.TYPEORM_MIGRATIONS],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
} as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
