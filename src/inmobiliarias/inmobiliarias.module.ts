import { Module } from '@nestjs/common';
import { InmobiliariaService } from './services/inmobiliarias.service';
import { InmobiliariasController } from './controller/inmobiliarias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InmobiliariaEntity } from './entity/inmobiliarias.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([InmobiliariaEntity]), ConfigModule,],
  controllers: [InmobiliariasController],
  providers: [InmobiliariaService],
  exports: [InmobiliariaService, TypeOrmModule,],

})
export class InmobiliariasModule {}
