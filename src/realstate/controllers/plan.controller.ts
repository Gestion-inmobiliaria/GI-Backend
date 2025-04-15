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
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ORDER_ENUM } from 'src/common/constants';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PlanService } from '../services/plan.service';
import { CreatePlanDto, UpdatePlanDto } from '../dto/plan.dto';
import { GetUser } from '@/users/decorators/get-user.decorator';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {

  constructor(
    private readonly planService: PlanService,
    private readonly subscriptionService: SubscriptionService,
  ) { }

  @Post()
  public async create(
    @Body() createPlanDto: CreatePlanDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.planService.create(createPlanDto),
    };
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.planService.findAll(queryDto);
    return {
      statusCode: 200,
      data: data,
      countData,
    };
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.planService.findOne(userId),
    };
  }

  @ApiParam({ name: 'userId', type: 'string' })
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.planService.update(userId, updatePlanDto),
    };
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  public async remove(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return await this.planService.delete(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiParam({ name: 'realstateId', type: 'string' })
  @ApiParam({ name: 'id', type: 'string' })
  @Post(':id/:realstateId/subscription')
  public async createSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('realstateId', ParseUUIDPipe) realstateId: string,
    @GetUser('userId') userId: string
  ): Promise<ResponseMessage> {
    const { data } = await this.subscriptionService.create(userId, id, realstateId)
    return {
      statusCode: 201,
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @Get(':realstateId/subscription-active')
  public async getSubscriptionActive(
    @Param('realstateId', ParseUUIDPipe) realstateId: string,
    @GetUser('userId') userId: string
  ): Promise<ResponseMessage> {
    return await this.subscriptionService.getSubscriptionActive(userId, realstateId)
  }
}
