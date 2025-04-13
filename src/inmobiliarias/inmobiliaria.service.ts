import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InmobiliariaEntity } from './entities/inmobiliaria.entity';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class InmobiliariaService {
  private readonly logger = new Logger('InmobiliariaService');

  constructor(
    @InjectRepository(InmobiliariaEntity)
    private readonly repo: Repository<InmobiliariaEntity>,
  ) {}

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.repo.createQueryBuilder('inmobiliaria');

      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('inmobiliaria.nombre', order.toUpperCase() as any);
      if (attr && value)
        query.andWhere(`inmobiliaria.${attr} ILIKE :value`, { value: `%${value}%` });

      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<InmobiliariaEntity> {
    try {
      const item = await this.repo.findOne({ where: { id } });
      if (!item) throw new NotFoundException('Inmobiliaria no encontrada');
      return item;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async create(data: Partial<InmobiliariaEntity>): Promise<InmobiliariaEntity> {
    try {
      const item = this.repo.create(data);
      return await this.repo.save(item);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, data: Partial<InmobiliariaEntity>): Promise<InmobiliariaEntity> {
    try {
      const item = await this.findOne(id);
      Object.assign(item, data);
      return await this.repo.save(item);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const item = await this.findOne(id);
      const result = await this.repo.remove(item);
      if (!result) throw new BadRequestException('No se pudo eliminar la inmobiliaria.');
      return { statusCode: 200, message: 'Inmobiliaria eliminada correctamente.' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}

