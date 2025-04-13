import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBranchDto, UpdateBranchDto } from '../dto';
import { BranchEntity } from '../entities/branch.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';

@Injectable()
export class BranchService {
  private readonly logger = new Logger('BranchService');

  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepository: Repository<BranchEntity>,
  ) {}

  public async create(createBranchDto: CreateBranchDto): Promise<BranchEntity> {
    try {
      // Creamos la entidad pero explícitamente sin la relación de usuarios
      const branchDataAny = createBranchDto as any;
      const { users, ...branchData } = branchDataAny;
      
      // Aseguramos que la propiedad users sea undefined para evitar problemas con typeORM
      const branchCreate = this.branchRepository.create(branchData);
      
      // Guardamos la entidad y aseguramos que se devuelva como una entidad singular
      const result = await this.branchRepository.save(branchCreate);
      const branchSaved = Array.isArray(result) ? result[0] : result;
      
      // Retornamos la entidad guardada
      return branchSaved;
    } catch (error) {
      this.logger.error(`Error al crear sucursal: ${error.message}`);
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.branchRepository.createQueryBuilder('branch');
      
      // Aplicar filtros
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('branch.name', order.toLocaleUpperCase() as any);
      if (attr && value)
        query.andWhere(`branch.${attr} ILIKE :value`, { value: `%${value}%` });

      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<BranchEntity> {
    try {
      const branch: BranchEntity = await this.branchRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      
      if (!branch) throw new NotFoundException('Sucursal no encontrada.');
      return branch;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(
    id: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<BranchEntity> {
    try {
      const branch: BranchEntity = await this.findOne(id);
      const branchUpdated = await this.branchRepository.update(
        branch.id,
        updateBranchDto,
      );
      
      if (branchUpdated.affected === 0)
        throw new BadRequestException('Sucursal no actualizada');
      
      return await this.findOne(id);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const branch: BranchEntity = await this.findOne(id);
      const branchDeleted = await this.branchRepository.update(branch.id, {
        isActive: false,
      });
      
      if (branchDeleted.affected === 0)
        throw new BadRequestException('La sucursal no se ha podido eliminar');
      
      return { statusCode: 200, message: 'Sucursal desactivada' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  // Método adicional para contar sucursales
  public async count(queryDto: QueryDto): Promise<number> {
    try {
      const { attr, value } = queryDto;
      const query = this.branchRepository.createQueryBuilder('branch');
      
      if (attr && value)
        query.andWhere(`branch.${attr} ILIKE :value`, { value: `%${value}%` });
      
      return await query.getCount();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
} 