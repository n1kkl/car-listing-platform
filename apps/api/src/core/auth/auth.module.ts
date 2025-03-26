import { Module } from '@nestjs/common';
import {
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.getOrThrow<string>('KEYCLOAK_URL'),
        realm: configService.getOrThrow<string>('KEYCLOAK_REALM'),
        clientId: configService.getOrThrow<string>('KEYCLOAK_CLIENT_ID'),
        secret: configService.getOrThrow<string>('KEYCLOAK_CLIENT_SECRET'),
        policyEnforcement: PolicyEnforcementMode.ENFORCING,
        tokenValidation: TokenValidation.ONLINE,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  exports: [KeycloakConnectModule],
})
export class AuthModule {}
