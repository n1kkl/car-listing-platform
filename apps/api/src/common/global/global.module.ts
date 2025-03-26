import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        '.env.development',
        '.env.production',
        '.env.local',
      ],
    }),
  ],
  exports: [ConfigModule],
})
export class GlobalModule {}
