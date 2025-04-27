import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDto } from 'src/common/dto/query.dto';
import { SectorEntity } from './entities/sector.entity';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';
import { RealStateService } from '@/realstate/services/realstate.service';



@Injectable()
export class SectorsService {
    private readonly logger = new Logger('SectorsService');

    constructor(
        @InjectRepository(SectorEntity)
        private readonly sectorRepository: Repository<SectorEntity>,
        private readonly realStateService: RealStateService
    ) { }

    public async create({ realStateId, ...res }: CreateSectorDto): Promise<SectorEntity> {
        try {
            const realState = await this.realStateService.findOne(realStateId);
            const sector = this.sectorRepository.create({
                name: res.name,
                adress: res.adress,
                phone: res.phone,
                realState: realState
            });
            return await this.sectorRepository.save(sector);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
        try {
            const { limit, offset, order, attr, value } = queryDto;
            const query = this.sectorRepository.createQueryBuilder('sector');

            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('sector.name', order.toUpperCase() as any);
            if (attr && value) {
                query.andWhere(`sector.${attr} ILIKE :value`, { value: `%${value}%` });
            }
            return {
                data: await query.getMany(),
                countData: await query.getCount(),
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<SectorEntity> {
        try {
            const sector = await this.sectorRepository.findOne({
                where: { id },
                relations: ['realState'],
            })
            return sector;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async update(id: string, updateSectorDto: UpdateSectorDto): Promise<SectorEntity> {
        try {
            const sector = await this.findOne(id);
            Object.assign(sector, updateSectorDto);
            return await this.sectorRepository.save(sector);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string): Promise<ResponseMessage> {
        try {
            const sector = await this.findOne(id);
            const result = await this.sectorRepository.remove(sector);
            if (!result) throw new BadRequestException('El sector no se pudo eliminar.');
            return { statusCode: 200, message: 'Sector eliminado correctamente.' };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
