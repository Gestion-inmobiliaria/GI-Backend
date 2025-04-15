import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,  
  Req,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { CreateRealState, UpdateRealStateDto } from '../dto';
import { RealStateService } from '../services/realstate.service';
import { GetUser } from '@/users/decorators/get-user.decorator';
import { Request } from 'express';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Realstate')
@Controller('realstate')
export class RealStateController {

  constructor(
    private readonly realStateService: RealStateService,
    private readonly subscriptionService: SubscriptionService
  ) { }
  private readonly logger = new Logger('LoggerController');

  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @PermissionAccess(PERMISSION.REALSTATE, PERMISSION.REALSTATE_CREATE)
  @Post()
  public async create(
    @Body() createRealStateDto: CreateRealState,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.realStateService.create(createRealStateDto),
    };
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @PermissionAccess(PERMISSION.REALSTATE, PERMISSION.REALSTATE_SHOW)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.realStateService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @PermissionAccess(PERMISSION.REALSTATE, PERMISSION.REALSTATE_SHOW)
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.realStateService.findOne(userId),
    };
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @PermissionAccess(PERMISSION.REALSTATE, PERMISSION.REALSTATE_UPDATE)
  @ApiParam({ name: 'userId', type: 'string' })
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateRealStateDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.realStateService.update(userId, updateUserDto),
    };
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @PermissionAccess(PERMISSION.REALSTATE, PERMISSION.REALSTATE_DELETE)
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  public async remove(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return await this.realStateService.delete(userId);
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @Get(':realstateId/payments')
  public async getSubscriptionActive(
    @Param('realstateId', ParseUUIDPipe) realstateId: string,
    @GetUser('userId') userId: string
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.realStateService.getPayments(userId, realstateId),
    };
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          example: 100,
        },
        currency: {
          type: 'string',
          example: 'USDT',
        },
        userId: {
          type: 'string',
          example: 'UUID',
        },
        planId: {
          type: 'string',
          example: 'UUID',
        },
        realstateId: {
          type: 'string',
          example: 'UUID',
        },
      },
    },
  })
  @Post('checkout')
  async checkout(@Body() body: {
    amount: number; currency: string, userId: string, planId: string, realstateId: string
  }) {
    try {
      const { userId, planId, realstateId } = body
      const data = await this.realStateService.createPayment(body.amount, body.currency, userId, planId, realstateId);
      return data
    } catch (error) {
      throw new HttpException('Failed to process payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('webhook')
  async webhook(@Req() req: Request) {

    const sign = req.body.sign;
    if (!sign) {
      return { message: 'Invalid sign' }
    }

    const isValid = this.realStateService.validateWebhookSignature(req.rawBody, sign);

    if (!isValid) {
      return { message: 'Invalid sign' }
    }

    const responseJson = JSON.parse(req.body.additional_data);
    const { userId, planId, realstateId } = responseJson

    const subscription = await this.subscriptionService.create(userId, planId, realstateId)

    return {
      message: 'Webhook received',
      data: req.body,
      subscription,
    }
  }
}
