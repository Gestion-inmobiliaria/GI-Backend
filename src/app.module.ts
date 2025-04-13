import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { InmobiliariaModule } from './inmobiliarias/inmobiliaria.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    ProvidersModule,
    CommonModule,      
    UsersModule,
    ClientsModule,
    InmobiliariaModule,
  ]
})
export class AppModule { }
