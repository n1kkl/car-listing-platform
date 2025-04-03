import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Profile } from './profile.entity';
import { ProfileController } from './profile.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Profile])],
  providers: [ProfileService],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
