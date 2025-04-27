import { Repository } from 'typeorm';
import { State } from '../entities/state.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStateDto } from '../dto/create-state.dto';
import { UpdateStateDto } from '../dto/update-state.dto';
import { Injectable, NotFoundException } from '@nestjs/common';



@Injectable()
export class StateService {
    constructor(
        @InjectRepository(State)
        private readonly stateRepository: Repository<State>,
    ) {}

    async create(createStateDto: CreateStateDto): Promise<State> {
        const state = this.stateRepository.create(createStateDto);
        return await this.stateRepository.save(state);
    }

    async findAll(): Promise<State[]> {
        return await this.stateRepository.find({
            relations: ['sector', 'user'],
        });
    }

    async findOne(id: number): Promise<State> {
        const state = await this.stateRepository.findOne({
            where: { id: id.toString() },
            relations: ['sector', 'user'],
        });
        if (!state) {
            throw new NotFoundException(`Inmueble con ID ${id} no encontrado`);
        }
        return state;
    }

    async update(id: number, updateStateDto: UpdateStateDto): Promise<State> {
        const state = await this.findOne(id);
        this.stateRepository.merge(state, updateStateDto);
        return await this.stateRepository.save(state);
    }

    async remove(id: number): Promise<void> {
        const state = await this.findOne(id);
        await this.stateRepository.remove(state);
    }
}
