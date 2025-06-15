import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import  { PropertyModule } from '@/property/property.module';
import { ImpulsarPropertyService } from './services/impulsar_property.service';
import { ImpulsarPropertyController } from './controller/impulsar_property.controller';
import { ImpulsarProperty } from './entities/impulsar_property.entity';

@Module({
   imports: [
           TypeOrmModule.forFeature([
               ImpulsarProperty,
           ]),
           UsersModule,
           PropertyModule,
           ConfigModule
       ],
  controllers: [ImpulsarPropertyController],
  providers: [ImpulsarPropertyService],

  exports: [
    ImpulsarPropertyService,
  ],
})
export class ImpulsarPropertyModule {}
