import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';
  


@ApiTags('Sectors')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('sector')
export class SectorsController {
    constructor(private readonly sectorsService: SectorsService) {}
  
    @PermissionAccess(PERMISSION.SECTOR)
    @Post()
    public async create( @Body() createSectorDto: CreateSectorDto ): Promise<ResponseMessage> {
        return {
          statusCode: 201,
          data: await this.sectorsService.create(createSectorDto),
        };
    }
  
    @PermissionAccess(PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @Get()
    public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
        const { countData, data } = await this.sectorsService.findAll(queryDto);
        return {
            statusCode: 200,
            data,
            countData,
        };
    }
  
    @PermissionAccess(PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW)
    @ApiParam({ name: 'sectorId', type: 'string' })
    @Get(':sectorId')
    public async findOne( @Param('sectorId', ParseUUIDPipe) sectorId: string ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.sectorsService.findOne(sectorId),
        };
    }
  
    @PermissionAccess(PERMISSION.SECTOR)
    @ApiParam({ name: 'sectorId', type: 'string' })
    @Patch(':sectorId')
    public async update(
      @Param('sectorId', ParseUUIDPipe) sectorId: string,
      @Body() updateSectorDto: UpdateSectorDto,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.sectorsService.update(sectorId, updateSectorDto),
        };
    }
  
    @PermissionAccess(PERMISSION.SECTOR)
    @ApiParam({ name: 'sectorId', type: 'string' })
    @Delete(':sectorId')
    public async remove( @Param('sectorId', ParseUUIDPipe) sectorId: string ): Promise<ResponseMessage> {
        return await this.sectorsService.remove(sectorId);
    }
}
