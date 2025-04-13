import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { InmobiliariaService } from './inmobiliaria.service';
import { InmobiliariaEntity } from './entities/inmobiliaria.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateInmobiliariaDto } from './dto/create-inmobiliaria.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Inmobiliaria')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller('inmobiliaria')
export class InmobiliariaController {
  constructor(private readonly service: InmobiliariaService) { }

  @Get()
  findAll(@Query() query: QueryDto): Promise<ResponseGet> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InmobiliariaEntity> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: CreateInmobiliariaDto): Promise<InmobiliariaEntity> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<InmobiliariaEntity>): Promise<InmobiliariaEntity> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<ResponseMessage> {
    return this.service.delete(id);
  }
}
