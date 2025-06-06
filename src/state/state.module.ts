import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryEntity } from './entities/category.entity';
import { ModalityController } from './controllers/modality.controller';
import { ModalityService } from './services/modality.service';
import { ModalityEntity } from './entities/modality.entity';
import { PropertyEntity } from '@/property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ModalityEntity, PropertyEntity])],
  controllers: [CategoryController, ModalityController],
  providers: [CategoryService, ModalityService],
  exports: [CategoryService, ModalityService] 
})
export class StateModule {}
