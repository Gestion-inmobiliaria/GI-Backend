import { ORDER_ENUM } from 'src/common/constants';
import { QueryDto } from 'src/common/dto/query.dto';
import { ResponseMessage } from 'src/common/interfaces';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PropertyService } from '../services/property.service';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { UniversalAuthGuard } from '@/users/guards/universal-auth.guard';
import { CreatePropertyDto, UpdatePropertyDto } from '@/property/dto/index';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';



@ApiTags('Property')
@Controller('property')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    @UseGuards(AuthGuard, PermissionGuard)
    @ApiBearerAuth()
    @PermissionAccess(PERMISSION.SECTOR)
    @Post()
    public async create(@Body() createPropertyDto: CreatePropertyDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.propertyService.create(createPropertyDto),
        };
    }
  

//     @UseGuards(UniversalAuthGuard)
//     @ApiBearerAuth()
//     @PermissionAccess(PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW)
//     @PermissionAccess(PERMISSION.SECTOR, PERMISSION.PROPERTY_SHOW)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @Get()
    public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
        const { countData, data } = await this.propertyService.findAll(queryDto);
        return {
            statusCode: 200,
            data,
            countData,
        };
    }


    // @UseGuards(AuthGuard, PermissionGuard)
    // @ApiBearerAuth()
    // @PermissionAccess(PERMISSION.SECTOR, PERMISSION.PROPERTY_SHOW)

//     @UseGuards(AuthGuard, PermissionGuard)
//     @ApiBearerAuth()
//     @PermissionAccess(PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW)

    @ApiParam({ name: 'propertyId', type: 'string' })
    @Get(':propertyId')
    public async findOne(@Param('propertyId', ParseUUIDPipe) propertyId: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.propertyService.findOne(propertyId),
        };
    }

    @UseGuards(UniversalAuthGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'propertyId', type: 'string' })
    @Get(':propertyId/agent')
    public async getPropertyAgent(@Param('propertyId', ParseUUIDPipe) propertyId: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.propertyService.getPropertyAgent(propertyId),
        };
    }

    @UseGuards(AuthGuard, PermissionGuard)
    @ApiBearerAuth()
    @PermissionAccess(PERMISSION.SECTOR)
    @ApiParam({ name: 'propertyId', type: 'string' })
    @Patch(':propertyId')
    public async update(@Param('propertyId', ParseUUIDPipe) propertyId: string, @Body() updatePropertyDto: UpdatePropertyDto): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.propertyService.update(propertyId, updatePropertyDto),
        };
    }

    @UseGuards(AuthGuard, PermissionGuard)
    @ApiBearerAuth()
    @PermissionAccess(PERMISSION.SECTOR)
    @ApiParam({ name: 'propertyId', type: 'string' })
    @Delete(':propertyId')
    public async delete(@Param('propertyId', ParseUUIDPipe) propertyId: string): Promise<ResponseMessage> {
        return await this.propertyService.delete(propertyId);
    }
}
