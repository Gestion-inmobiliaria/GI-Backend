import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { StateModule } from '@/state/state.module';
import { ImagenEntity } from './entities/imagen.entity';
import { SectorsModule } from '@/sectors/sectors.module'; 
import { ImagesService } from './services/image.service';
import { PropertyEntity } from './entities/property.entity';
import { ContractEntity } from './entities/contract.entity';
import { PropertyService } from './services/property.service';
import { UbicacionEntity } from './entities/ubicacion.entity';
import { ContractService } from './services/contract.service';
import { CloudinaryProvider } from '@/config/cloudinary.config';
import { UbicacionService } from './services/ubicacion.service';
import { ImagesController } from './controllers/image.controller';
import { PropertyController } from './controllers/property.controller';
import { ContractController } from './controllers/contract.controller';
import { UbicacionController } from './controllers/ubicacion.controller';
import { PaymentMethodEntity } from '@/realstate/entities/payment_method.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            PropertyEntity, 
            UbicacionEntity, 
            ImagenEntity, 
            ContractEntity,
            PaymentMethodEntity
        ]),
        UsersModule,
        SectorsModule,
        StateModule,
        ConfigModule
    ],
    controllers: [
        PropertyController, 
        UbicacionController, 
        ImagesController, 
        ContractController
    ],
    providers: [
        PropertyService, 
        UbicacionService, 
        CloudinaryProvider, 
        ImagesService, 
        ContractService
    ],
    exports: [
        PropertyService, 
        UbicacionService,
        TypeOrmModule, 
        ImagesService, 
        ContractService
    ],
})
export class PropertyModule {}
