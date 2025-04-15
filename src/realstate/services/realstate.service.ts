import { Repository } from 'typeorm';
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';

import { CreateRealState, UpdateRealStateDto } from '../dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { RealStateEntity } from '../entities/realstate.entity';
import { SubscriptionPaymentEntity } from '../entities/subscription_payment.entity';
import { SubscriptionEntity, SubscriptionState } from '../entities/subscription.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
// import { SubscriptionService } from './subscription.service';

@Injectable()
export class RealStateService {
  private readonly logger = new Logger('RealStateService');

  constructor(
    @InjectRepository(RealStateEntity)
    private readonly realStateRepository: Repository<RealStateEntity>,
    @InjectRepository(SubscriptionPaymentEntity)
    private readonly subscriptionPaymentRepository: Repository<SubscriptionPaymentEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private configService: ConfigService
  ) { }

  public async create(createRealState: CreateRealState): Promise<ResponseMessage> {
    try {
      const realState = this.realStateRepository.create({
        ...createRealState
      });
      await this.realStateRepository.save(realState);
      return {
        statusCode: 201,
        data: realState
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.realStateRepository.createQueryBuilder('realstate');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('realstate.name', order.toLocaleUpperCase() as any);
      if (attr && value)
        query.andWhere(`realstate.${attr} ILIKE :value`, { value: `%${value}%` });
      const [data, countData] = await query.getManyAndCount();
      return {
        data,
        countData,
      };

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<RealStateEntity> {
    try {
      const realState = await this.realStateRepository.findOne({
        where: { id },
        relations: ['sectores'],
      });
      if (!realState) {
        throw new Error('Real State not found');
      }
      return realState;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, update: UpdateRealStateDto): Promise<ResponseMessage> {
    try {
      const realState = await this.realStateRepository.findOne({ where: { id } });
      if (!realState) {
        throw new Error('Real State not found');
      }
      await this.realStateRepository.update(id, update);
      return {
        statusCode: 200,
        data: await this.realStateRepository.findOne({ where: { id } })
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const realState = await this.realStateRepository.findOne({ where: { id } });
      if (!realState) {
        throw new Error('Real State not found');
      }
      await this.realStateRepository.delete(id);
      return {
        statusCode: 200,
        message: 'Real State deleted successfully'
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async getPayments(userId: string, realstateId: string): Promise<SubscriptionPaymentEntity[]> {
    try {
      const subscriptionPaymentsRealState = await this.subscriptionPaymentRepository.createQueryBuilder('subscription_payment')
        .innerJoinAndSelect('subscription_payment.subscription', 'subscription')
        .innerJoinAndSelect('subscription.realState', 'realstate')
        .innerJoinAndSelect('subscription.plan', 'plan')
        .where('realstate.id = :realstateId', { realstateId })
        // ordenado
        .orderBy('subscription_payment.createdAt', 'DESC')
        .getMany();
      return subscriptionPaymentsRealState;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  async createPayment(amount: number, currency: string, userId: string, planId: string, realstateId: string) {
    const API_KEY = this.configService.get<string>('API_KEY');
    const MERCHANT_ID = this.configService.get<string>('MERCHANT_ID');
    const APP_URL = this.configService.get<string>('APP_URL');
    const APP_WEB_URL = this.configService.get<string>('APP_WEB_URL');
    const APP_SUCCESS = this.configService.get<string>('APP_SUCCESS');
    const APP_RETURN = this.configService.get<string>('APP_RETURN');

    this.logger.log({
      url_callback: `${APP_URL}/api/realstate/webhook`,
      url_success: `${APP_WEB_URL}${APP_SUCCESS}/${planId}/success`,
      url_return: `${APP_WEB_URL}${APP_RETURN}/${planId}`,
    })

    const payload = {
      amount,
      currency,
      order_id: crypto.randomBytes(12).toString('hex'),
      url_callback: `${APP_URL}/api/realstate/webhook`,
      url_success: `${APP_WEB_URL}${APP_SUCCESS}/${planId}/success`,
      url_return: `${APP_WEB_URL}${APP_RETURN}/${planId}`,
      additional_data: JSON.stringify({
        userId,
        planId,
        realstateId,
      }),
    };

    // const testPayload = {
    //   uuid: 'e1830f1b-50fc-432e-80ec-15b58ccac867',
    //   currency: 'ETH',
    //   url_callback: `${APP_URL}/api/realstate/webhook`,
    //   network: 'eth',
    //   status: 'paid',
    // }

    const sign = crypto
      .createHash('md5')
      .update(Buffer.from(JSON.stringify(payload)).toString('base64') + API_KEY)
      .digest('hex');

    const response = await axios.post('https://api.cryptomus.com/v1/payment', payload, {
      headers: {
        'Content-Type': 'application/json',
        merchant: MERCHANT_ID,
        sign: sign,
      },
    });

    return response.data;
  }

  validateWebhookSignature(rawBody: string, receivedSign: string): boolean {
    const API_KEY = this.configService.get<string>('API_KEY');

    const data = JSON.parse(rawBody);
    delete data.sign;

    const calculatedSign = crypto
      .createHash('md5')
      .update(Buffer.from(JSON.stringify(data)).toString('base64') + API_KEY)
      .digest('hex');

    return receivedSign === calculatedSign;
  }

}
