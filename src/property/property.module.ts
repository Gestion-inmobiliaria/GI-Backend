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
import { PaymentEntity } from './entities/payment.entity';
import { FavoriteEntity } from './entities/favorite.entity';
import { PropertyService } from './services/property.service';
import { UbicacionEntity } from './entities/ubicacion.entity';
import { ContractService } from './services/contract.service';
import { FavoriteService } from './services/favorite.service';
import { CloudinaryProvider } from '@/config/cloudinary.config';
import { UbicacionService } from './services/ubicacion.service';
import { ImagesController } from './controllers/image.controller';
import { PaymentController } from './controllers/payment.controller';
import { PropertyController } from './controllers/property.controller';
import { ContractController } from './controllers/contract.controller';
import { UbicacionController } from './controllers/ubicacion.controller';
import { FavoriteController } from './controllers/favorite.controller';
import { PaymentMethodEntity } from '@/realstate/entities/payment_method.entity';
import { PaymentStripeService } from '@/realstate/services/payment-stripe.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            PropertyEntity, 
            UbicacionEntity, 
            ImagenEntity, 
            ContractEntity,
            PaymentEntity,
            FavoriteEntity,
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
        ContractController,
        PaymentController,
        FavoriteController
    ],
    providers: [
        PropertyService, 
        UbicacionService, 
        CloudinaryProvider, 
        ImagesService, 
        ContractService,
        FavoriteService,
        PaymentStripeService
    ],
    exports: [
        PropertyService, 
        UbicacionService,
        TypeOrmModule, 
        ImagesService, 
        ContractService,
        FavoriteService
    ],
})
export class PropertyModule {}
