import { ORDER_ENUM } from 'src/common/constants';
import { QueryDto } from 'src/common/dto/query.dto';
import { ResponseMessage } from 'src/common/interfaces';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { UniversalAuthGuard } from '@/users/guards/universal-auth.guard';
import { CreatePropertyDto, UpdatePropertyDto } from '@/property/dto/index';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ImpulsarPropertyService } from '../services/impulsar_property.service';
import { CreateImpulsarPropertyDto } from '../dto/create-impulsar_property.dto';
import { UpdateImpulsarPropertyDto } from '../dto/update-impulsar_property.dto';
import { CancelImpulsarPropertyDto } from '../dto/create-cancelar_impulso.dto';


@ApiTags('Impulsar Property')
@Controller('impulsar-property')
export class ImpulsarPropertyController {
  constructor(private readonly impulsarPropertyService: ImpulsarPropertyService) {}

  //@UseGuards(AuthGuard, PermissionGuard)
  //@ApiBearerAuth()
  //@PermissionAccess(PERMISSION.SECTOR)
  @Post()
   public async create(@Body() createImpulsarPropertyDto: CreateImpulsarPropertyDto): Promise<ResponseMessage>{
    return {
     statusCode: 201,
     data: await this.impulsarPropertyService.create(createImpulsarPropertyDto),
    }
  }

  //@UseGuards(AuthGuard, PermissionGuard)
  //@ApiBearerAuth()
  //@PermissionAccess(PERMISSION.SECTOR)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const {countData, data}= await this.impulsarPropertyService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  //@UseGuards(AuthGuard, PermissionGuard)
  //@ApiBearerAuth()
  //@PermissionAccess(PERMISSION.SECTOR)
  @ApiParam({ name: 'impulsar_property_id', type: 'string' })
  @Get(':impulsar_property_id')
  public async findOne(@Param('impulsar_property_id') impulsar_property_id: string): Promise<ResponseMessage> {
  const data = await this.impulsarPropertyService.findOne(impulsar_property_id);
  return {
    statusCode: 200,
    data,
  };
}

  //@UseGuards(AuthGuard, PermissionGuard)
  //@ApiBearerAuth()
  //@PermissionAccess(PERMISSION.SECTOR)
  @ApiParam({ name: 'impulsar_property_id', type: 'string' })
  @Patch(':impulsar_property_id')
  public async update(@Param('impulsar_property_id') impulsar_property_id: string,@Body() updateImpulsarPropertyDto: UpdateImpulsarPropertyDto): Promise<ResponseMessage> {
   const data = await this.impulsarPropertyService.update(impulsar_property_id,updateImpulsarPropertyDto);
   return {
    statusCode: 200,
     data,
   };
  }

  //@UseGuards(AuthGuard, PermissionGuard)
  //@ApiBearerAuth()
  //@PermissionAccess(PERMISSION.SECTOR)
  @ApiBody({ type: CancelImpulsarPropertyDto, description: 'Razón para cancelar el impulso' })
  @ApiParam({ name: 'impulsar_property_id', type: 'string' })
  @Patch(':impulsar_property_id/cancelar')
  public async cancelar(@Param('impulsar_property_id') impulsar_property_id: string, @Body() cancelarDto: CancelImpulsarPropertyDto){
   return await this.impulsarPropertyService.cancelarImpulso(impulsar_property_id,cancelarDto);
  }
  
  //@UseGuards(AuthGuard, PermissionGuard)
  //@ApiBearerAuth()
  //@PermissionAccess(PERMISSION.SECTOR)
  @ApiParam({ name: 'impulsar_property_id', type: 'string', description: 'ID del impulso a eliminar' })
  @Delete(':impulsar_property_id')
  public async remove(@Param('impulsar_property_id') impulsar_property_id: string): Promise<ResponseMessage> {
   return await this.impulsarPropertyService.remove(impulsar_property_id);
  }
}