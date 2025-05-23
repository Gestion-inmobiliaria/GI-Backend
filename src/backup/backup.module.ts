import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupService } from './services/backup.service';
import { BackupController } from './controller/backup.controller';


@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        ConfigModule
    ],
    controllers: [
        BackupController
    ],
    providers: [
        BackupService
    ],
    exports: [
        BackupService
    ],
})

export class BackupModule {}
