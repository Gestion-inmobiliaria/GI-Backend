import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntity } from './entities/state.entity';
import { StateService } from './services/state.service';
import { StateController } from './controllers/state.controller';



@Module({
    imports: [TypeOrmModule.forFeature([StateEntity])],
    controllers: [StateController],
    providers: [StateService],
    exports: [StateService],
})

export class StateModule {}
