import 'dotenv/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

if (!process.env.DB_URL) {
  throw new Error('"DB_URL" is a required environment variable');
}

const config: MikroOrmModuleOptions = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  driver: PostgreSqlDriver,
  clientUrl: process.env.DB_URL,
  extensions: [Migrator],
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
