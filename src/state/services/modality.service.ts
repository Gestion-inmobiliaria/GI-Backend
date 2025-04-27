import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Modality } from '../entities/modality.entity';
import { CreateModalityDto } from '../dto/create-modality.dto';
import { UpdateModalityDto } from '../dto/update-modality.dto';



@Injectable()
export class ModalityService {
    constructor(
        @InjectRepository(Modality)
        private readonly modalityRepository: Repository<Modality>,
    ) {}

    async create(createModalityDto: CreateModalityDto): Promise<Modality> {
        const modality = this.modalityRepository.create(createModalityDto);
        return this.modalityRepository.save(modality);
    }

    async findAll(): Promise<Modality[]> {
        return this.modalityRepository.find();
    }

    async findOne(id: string): Promise<Modality> {
        const modality = await this.modalityRepository.findOne({ where: { id } });
        if (!modality) {
            throw new NotFoundException(`Modality with ID ${id} not found`);
        }
        return modality;
    }

    async update(id: string, updateModalityDto: UpdateModalityDto): Promise<Modality> {
        const modality = await this.findOne(id);
        Object.assign(modality, updateModalityDto);
        return this.modalityRepository.save(modality);
    }

    async remove(id: string): Promise<void> {
        	const modality = await this.findOne(id);
        	await this.modalityRepository.remove(modality);
    }
}
