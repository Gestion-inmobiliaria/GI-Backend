
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InmobiliariaEntity } from './entities/inmobiliaria.entity';
import { InmobiliariaService } from './inmobiliaria.service';
import { InmobiliariaController } from './inmobiliaria.controller';
import { UsersModule } from 'src/users/users.module'; // 👈 importa esto

@Module({
  imports: [
    TypeOrmModule.forFeature([InmobiliariaEntity]),
    UsersModule, 
  ],
  controllers: [InmobiliariaController],
  providers: [InmobiliariaService],
  exports: [InmobiliariaService],
})
export class InmobiliariaModule {}
