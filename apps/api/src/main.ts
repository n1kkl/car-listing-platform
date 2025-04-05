import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';

export let i18nService: I18nService;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appUrl =
    configService.get<string>('APP_URL') || 'http://localhost:3000';

  i18nService = app.get(I18nService);

  const config = new DocumentBuilder()
    .setTitle('CLP API')
    .setVersion(version)
    .addServer(appUrl, 'default')
    .addOAuth2(
      {
        type: 'oauth2',
        name: 'keycloak',
        flows: {
          authorizationCode: {
            authorizationUrl: configService.get<string>('KEYCLOAK_AUTH_URL'),
            tokenUrl: configService.get<string>('KEYCLOAK_TOKEN_URL'),
            refreshUrl: configService.get<string>('KEYCLOAK_TOKEN_URL'),
            scopes: {
              openid: 'openid',
              profile: 'profile',
              email: 'email',
            },
          },
        },
      },
      'JWT',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.use(helmet()); // must be first middleware, see https://docs.nestjs.com/security/helmet
  app.setGlobalPrefix(configService.get('APP_PREFIX') || 'api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
