import { Repository } from 'typeorm';
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { PlanEntity } from '../entities/plan.entity';
import { CreatePlanDto, UpdatePlanDto } from '../dto/plan.dto';

@Injectable()
export class PlanService {
  private readonly logger = new Logger('PlanService');

  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) { }

  public async create(createPlan: CreatePlanDto): Promise<ResponseGet> {
    try {
      const plan = this.planRepository.create({
        ...createPlan,
        is_active: true
      });

      await this.planRepository.save(plan);
      return {
        data: plan
      }

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.planRepository.createQueryBuilder('plan');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      // if (order) query.orderBy('plan.name', order.toLocaleUpperCase() as any);
      if (attr && value)
        query.andWhere(`plan.${attr} ILIKE :value`, { value: `%${value}%` });
      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<PlanEntity> {
    try {
      const plan = await this.planRepository.findOne({
        where: {
          id
        }
      });
      if (!plan) {
        throw new Error('Plan not found');
      }
      return plan;

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, update: UpdatePlanDto): Promise<ResponseMessage> {
    try {
      const plan = await this.findOne(id);
      if (!plan) {
        throw new Error('Plan not found');
      }
      await this.planRepository.update(id, update);
      return {
        statusCode: 200,
        data: (await this.findOne(id))
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const plan = await this.findOne(id);
      if (!plan) {
        throw new Error('Plan not found');
      }
      await this.planRepository.delete(id);
      return {
        statusCode: 200,
        data: "Plan deleted successfully"
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async clear(): Promise<void> {
    try {
      await this.planRepository.clear();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
