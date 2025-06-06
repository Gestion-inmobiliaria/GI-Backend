import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {StateModule} from './state/state.module';
import { UsersModule } from './users/users.module';
import { SeederModule } from './seeder/seed.module';
import { CommonModule } from './common/common.module';
import { DataSourceConfig } from './config/data.source';
import { SectorsModule } from './sectors/sectors.module';
import { PropertyModule } from './property/property.module';
import { RealstateModule } from './realstate/realstate.module';
import { ProvidersModule } from './providers/providers.module';
import { ReportModule } from './reports/report.module';
import { BackupModule } from './backup/backup.module';


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        TypeOrmModule.forRoot({ ...DataSourceConfig }),
        ProvidersModule,
        CommonModule,
        UsersModule,
        RealstateModule,
        SectorsModule,
        PropertyModule,
        StateModule,
        ReportModule,
        SeederModule,
        BackupModule,
    ]
})

export class AppModule {}
