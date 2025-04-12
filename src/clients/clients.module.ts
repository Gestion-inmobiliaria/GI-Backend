import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { ConfigModule } from '@nestjs/config';



@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientEntity
        ]),
        ConfigModule,
    ],
    controllers: [ClientsController],
    providers: [ClientsService],
    exports: [
        ClientsService,
        TypeOrmModule,
    ],
})

export class ClientsModule {}
