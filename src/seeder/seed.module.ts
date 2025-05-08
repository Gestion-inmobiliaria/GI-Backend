import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { RealstateModule } from '@/realstate/realstate.module';
import { StateModule } from '@/state/state.module';
import { PropertyModule } from '@/property/property.module';
import { SectorsModule } from '@/sectors/sectors.module';

@Module({
    imports: [
        UsersModule, 
        RealstateModule,
        StateModule,
        PropertyModule,
        SectorsModule
    ],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeederModule { }