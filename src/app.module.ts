import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';
import { SeederModule } from './seeder/seed.module';
import { UsersModule } from './users/users.module';
import { SectorsModule } from './sectors/sectors.module';



@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        TypeOrmModule.forRoot({ ...DataSourceConfig }),
        ProvidersModule,
        CommonModule,      
        UsersModule,
        SeederModule,
        SectorsModule,
    ]
})
export class AppModule {}
