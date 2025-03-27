import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import helmet from 'helmet';

export let i18nService: I18nService;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  i18nService = app.get(I18nService);

  app.use(helmet()); // must be first middleware, see https://docs.nestjs.com/security/helmet
  app.setGlobalPrefix(configService.get('APP_PREFIX') || 'api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
