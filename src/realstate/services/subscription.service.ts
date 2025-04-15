import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { PlanInterval } from '../entities/plan.entity';
import { UpdatePlanDto } from '../dto/plan.dto';
import { SubscriptionEntity, SubscriptionState } from '../entities/subscription.entity';
import { UserService } from '@/users/services/users.service';
import { PlanService } from './plan.service';
import { RealStateService } from './realstate.service';
import { PAYMENT_STATE, SubscriptionPaymentEntity } from '../entities/subscription_payment.entity';
import { PaymentMethodService } from './payment_method.service';
import { PAYMENTMETHOD } from '../entities/payment_method.entity';
import { RoleService } from '@/users/services/role.service';
import { ROLE } from '@/users/constants/role.constant';
import { getDate } from '@/common/utils';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger('SubscriptionService');

  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(SubscriptionPaymentEntity)
    private readonly subscriptionPaymentRepository: Repository<SubscriptionPaymentEntity>,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly planService: PlanService,
    private readonly realstateService: RealStateService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly dataSources: DataSource,
  ) { }

  public async create(userId: string, planId: string, realstateId: string): Promise<ResponseGet> {
    try {
      const queryRunner = this.dataSources.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // const user = await this.userService.findOne(userId);
        const realState = await this.realstateService.findOne(realstateId);
        const plan = await this.planService.findOne(planId);
        const { date, time } = getDate()

        const currentSubscription = await this.getSubscriptionActive(userId, realstateId);
        if (currentSubscription.data) {
          currentSubscription.data.state = SubscriptionState.inactive;
          await this.subscriptionRepository.save(currentSubscription.data);
          await queryRunner.manager.save(currentSubscription.data);
        }

        const newSubscription = this.subscriptionRepository.create({
          init_date: `${date} ${time}`,
          end_date: '',
          last_payment_date: `${date} ${time}`,
          next_payment_date: plan.interval === PlanInterval.month
            ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
            : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          realState,
          plan,
        });
        const subscriptionSaved = await this.subscriptionRepository.save(newSubscription);
        await queryRunner.manager.save(subscriptionSaved);

        const payment_method = await this.paymentMethodService.findByName(PAYMENTMETHOD.crypto);
        const newPayment = this.subscriptionPaymentRepository.create({
          amount: plan.unit_amount,
          payment_date: `${date} ${time}`,
          state: PAYMENT_STATE.paid,
          payment_method,
          subscription: { id: subscriptionSaved.id }
        });

        const subscriptionPaymentSaved = await this.subscriptionPaymentRepository.save(newPayment);
        await queryRunner.manager.save(subscriptionPaymentSaved);

        const roleFound = await this.roleService.findOneBy({
          key: 'name', value: ROLE.ADMIN
        })

        const userUpdate = await this.userService.update(userId, { role: roleFound.id })

        await queryRunner.manager.save(userUpdate);

        await queryRunner.commitTransaction();

        return {
          data: newSubscription,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('Error creating subscription');
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      return {
        data: [],
        countData: 0,
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<ResponseMessage> {
    try {

      return {
        statusCode: 200,
        data: {},
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, update: UpdatePlanDto): Promise<ResponseMessage> {
    try {
      return {
        statusCode: 200,
        data: {},
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      return {
        statusCode: 200,
        data: {},
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async getSubscriptionActive(userId: string, realstateId: string): Promise<ResponseMessage> {
    try {
      // const user = await this.userService.findOne(userId);
      // const realState = await this.realstateService.findOne(realstateId);
      const subscription = await this.subscriptionRepository.findOne({
        where: {
          realState: { id: realstateId },
          state: SubscriptionState.active
        },
        relations: ['realState', 'plan'],
      });

      return {
        statusCode: 200,
        data: subscription,
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

}
