import { Controller,
  Post,
  Body, 
  Delete,Get,
  Param,
  Patch,
  Query,
  UseGuards,
  ParseUUIDPipe,
 } from '@nestjs/common';
import {InmobiliariaService} from '../services/inmobiliarias.service';
import {CreateInmobiliariasDto} from '../dto/create-inmobiliarias.dto';
import { UpdateInmobiliariasDto } from '../dto/update-inmobiliarias.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ResponseMessage } from 'src/common/interfaces/responseMessage.interface';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ORDER_ENUM } from 'src/common/constants';


@ApiTags('Inmobiliarias')
@ApiBearerAuth()
@Controller('inmobiliaria')
export class InmobiliariasController {
 
 constructor(private readonly inmobiliariaService:InmobiliariaService){}

 @Post()
 public async create(@Body() createInmobiliariasDto: CreateInmobiliariasDto): Promise<ResponseMessage> {
  return {statusCode: 201, data: await this.inmobiliariaService.create(createInmobiliariasDto)};
 } 

   @ApiQuery({ name: 'limit', type: 'number', required: false })
   @ApiQuery({ name: 'offset', type: 'number', required: false })
   @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
   @ApiQuery({ name: 'attr', type: 'string', required: false })
   @ApiQuery({ name: 'value', type: 'string', required: false })
   @Get()
   public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
     return { statusCode: 200, data: await this.inmobiliariaService.findAll(queryDto) };
   }

     @ApiParam({ name: 'id', type: 'string' })
     @Get(':id')
     public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
       return{ statusCode: 200, data: await this.inmobiliariaService.findOne(id)};
     }

     @ApiParam({ name: 'id', type: 'string'})
     @Patch(':id')
      public async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateInmobiliariasDto: UpdateInmobiliariasDto): Promise<ResponseMessage> {
        return { statusCode: 200, data: await this.inmobiliariaService.update(id, updateInmobiliariasDto)};
      }

      @ApiParam({ name: 'id', type: 'string'})
      @Delete(':id')
      public async remove(@Param('id',ParseUUIDPipe) id: string): Promise<ResponseMessage> {
        return await this.inmobiliariaService.remove(id);
      }
}