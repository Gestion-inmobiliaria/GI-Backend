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
import { BranchService } from '../services/branch.service';
import { CreateBranchDto, UpdateBranchDto } from '../dto';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';

@ApiTags('Branches')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @PermissionAccess(PERMISSION.BRANCH)
  @Post()
  public async create(
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.branchService.create(createBranchDto),
    };
  }

  @PermissionAccess(PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.branchService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  @PermissionAccess(PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW)
  @ApiParam({ name: 'branchId', type: 'string' })
  @Get(':branchId')
  public async findOne(
    @Param('branchId', ParseUUIDPipe) branchId: string,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.branchService.findOne(branchId),
    };
  }

  @PermissionAccess(PERMISSION.BRANCH)
  @ApiParam({ name: 'branchId', type: 'string' })
  @Patch(':branchId')
  public async update(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.branchService.update(branchId, updateBranchDto),
    };
  }

  @PermissionAccess(PERMISSION.BRANCH)
  @ApiParam({ name: 'branchId', type: 'string' })
  @Delete(':branchId')
  public async remove(
    @Param('branchId', ParseUUIDPipe) branchId: string,
  ): Promise<ResponseMessage> {
    return await this.branchService.delete(branchId);
  }
} 