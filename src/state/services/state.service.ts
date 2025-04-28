import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { StateEntity } from '../entities/state.entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateStateDto, ExcelStateDto, UpdateStateDto } from '@/state/dto/index-state.dto';



@Injectable()
export class StateService {
    constructor(
        @InjectRepository(StateEntity)
        private readonly stateRepository: Repository<StateEntity>,
    ) {}

    async create(createStateDto: CreateStateDto): Promise<StateEntity> {
        const state = this.stateRepository.create(createStateDto);
        return await this.stateRepository.save(state);
    }

    async findAll(): Promise<StateEntity[]> {
        return await this.stateRepository.find({
            relations: ['sector', 'user'],
        });
    }

    async findOne(id: number): Promise<StateEntity> {
        const state = await this.stateRepository.findOne({
            where: { id: id.toString() },
            relations: ['sector', 'user'],
        });
        if (!state) {
            throw new NotFoundException(`Inmueble con ID ${id} no encontrado`);
        }
        return state;
    }

    async update(id: number, updateStateDto: UpdateStateDto): Promise<StateEntity> {
        const state = await this.findOne(id);
        this.stateRepository.merge(state, updateStateDto);
        return await this.stateRepository.save(state);
    }

    async remove(id: number): Promise<void> {
        const state = await this.findOne(id);
        await this.stateRepository.remove(state);
    }

    async processExcelFile(file: Express.Multer.File, userId: number): Promise<{ success: number; errors: any[] }> {
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            const results = {
                success: 0,
                errors: [],
            };

            for (const [index, row] of data.entries()) {
                try {
                    // Transformar y validar los datos
                    const stateData = plainToClass(ExcelStateDto, row);
                    const errors = await validate(stateData);

                    if (errors.length > 0) {
                        results.errors.push({
                            row: index + 2, // +2 porque Excel empieza en 1 y la primera fila son headers
                            errors: errors.map(error => ({
                                property: error.property,
                                constraints: error.constraints,
                            })),
                        });
                        continue;
                    }

                    // Crear el inmueble
                    const state = this.stateRepository.create({
                        ...stateData,
                        user: { id: userId.toString() },
                        sector: { id: stateData.sectorId.toString() }
                    });

                    await this.stateRepository.save(state);
                    results.success++;
                } catch (error) {
                    results.errors.push({
                        row: index + 2,
                        error: error.message,
                    });
                }
            }

            return results;
        } catch (error) {
            throw new BadRequestException('Error al procesar el archivo Excel: ' + error.message);
        }
    }
}
