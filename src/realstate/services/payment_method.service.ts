import { Repository } from 'typeorm';
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { PAYMENTMETHOD, PaymentMethodEntity } from '../entities/payment_method.entity';

@Injectable()
export class PaymentMethodService {
  private readonly logger = new Logger('RealStateService');

  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodEntityRepository: Repository<PaymentMethodEntity>,
  ) { }

  public async create(name: PAYMENTMETHOD): Promise<ResponseMessage> {
    try {
      const paymentMethod = this.paymentMethodEntityRepository.create({
        name
      });
      await this.paymentMethodEntityRepository.save(paymentMethod);
      return {
        statusCode: 201,
        data: paymentMethod
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.paymentMethodEntityRepository.createQueryBuilder('payment_method');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('payment_method.name', order.toLocaleUpperCase() as any);
      if (attr && value)
        query.andWhere(`payment_method.${attr} ILIKE :value`, { value: `%${value}%` });
      const [data, countData] = await query.getManyAndCount();
      return {
        data,
        countData,
      };

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<PaymentMethodEntity> {
    try {
      const paymentMethod = await this.paymentMethodEntityRepository.findOne({
        where: {
          id
        }
      });
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      return paymentMethod;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findByName(name: PAYMENTMETHOD): Promise<PaymentMethodEntity> {
    try {
      const paymentMethod = await this.paymentMethodEntityRepository.findOne({
        where: {
          name
        }
      });
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      return paymentMethod;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, update: PAYMENTMETHOD): Promise<ResponseMessage> {
    try {
      const paymentMethod = await this.paymentMethodEntityRepository.findOne({ where: { id } });
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      await this.paymentMethodEntityRepository.update(id, { name: update });
      return {
        statusCode: 200,
        data: paymentMethod
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const paymentMethod = await this.paymentMethodEntityRepository.findOne({ where: { id } });
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      await this.paymentMethodEntityRepository.delete(id);
      return {
        statusCode: 200,
        data: paymentMethod
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

}
