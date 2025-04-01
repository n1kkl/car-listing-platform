import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        driver: PostgreSqlDriver,
        clientUrl: configService.getOrThrow<string>('DB_URL'),
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        debug: process.env.NODE_ENV !== 'production',
        metadataProvider: TsMorphMetadataProvider,
      }),
      inject: [ConfigService],
      driver: PostgreSqlDriver,
    }),
  ],
})
export class DatabaseModule {}
