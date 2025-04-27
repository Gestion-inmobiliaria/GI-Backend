import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateService } from './services/state.service';
import { StateController } from './controllers/state.controller';
import { State } from './entities/state.entity';

@Module({
    imports: [TypeOrmModule.forFeature([State])],
    controllers: [StateController],
    providers: [StateService],
    exports: [StateService],
})
export class StateModule {}
