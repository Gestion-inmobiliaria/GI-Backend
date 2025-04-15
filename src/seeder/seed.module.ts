import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { RealstateModule } from '@/realstate/realstate.module';

@Module({
    imports: [UsersModule, RealstateModule],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeederModule { }