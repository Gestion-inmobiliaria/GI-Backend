import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ResponseMessage } from 'src/common/interfaces';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';
  


@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller('client')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}
  
    // @PermissionAccess(PERMISSION.CLIENT)
    @Post()
    public async create(
      @Body() createClientDto: CreateClientDto,
    ): Promise<ResponseMessage> {
      return {
        statusCode: 201,
        data: await this.clientsService.create(createClientDto),
      };
    }
  
    // @PermissionAccess(PERMISSION.CLIENT, PERMISSION.CLIENT_SHOW)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @Get()
    public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
      const { countData, data } = await this.clientsService.findAll(queryDto);
      return {
        statusCode: 200,
        data,
        countData,
      };
    }
  
    // @PermissionAccess(PERMISSION.CLIENT, PERMISSION.CLIENT_SHOW)
    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    public async findOne(
      @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ResponseMessage> {
      return {
        statusCode: 200,
        data: await this.clientsService.findOne(id),
      };
    }
  
    // @PermissionAccess(PERMISSION.CLIENT)
    @ApiParam({ name: 'id', type: 'string' })
    @Patch(':id')
    public async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateClientDto: UpdateClientDto,
    ): Promise<ResponseMessage> {
      return {
        statusCode: 200,
        data: await this.clientsService.update(id, updateClientDto),
      };
    }
  
    // @PermissionAccess(PERMISSION.CLIENT)
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    public async remove(
      @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ResponseMessage> {
      await this.clientsService.remove(id);
      return {
        statusCode: 200,
        message: 'Client successfully deleted',
      };
    }
}
