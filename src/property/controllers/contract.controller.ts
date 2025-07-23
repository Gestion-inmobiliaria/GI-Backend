import { AuthGuard } from 'src/users/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContractEntity } from '../entities/contract.entity';
import { ContractService } from '../services/contract.service';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { CreateContractDto, UpdateContractDto } from '@/property/dto';
import { PermissionAccess } from "@/users/decorators/permissions.decorator";
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';



@ApiTags('Contracts')
// @UseGuards(AuthGuard, PermissionGuard)
// @ApiBearerAuth()
@Controller('contracts')
export class ContractController {
    constructor(private readonly contractService: ContractService) {}

    // @PermissionAccess(PERMISSION.CONTRACT)
    @Post()
    create(@Body() createContractDto: CreateContractDto): Promise<ContractEntity> {
        console.log("BIENVENIDO AL POST");
        console.log('Payload recibido en POST /contracts:', createContractDto);
        return this.contractService.create(createContractDto);
    }

    // @UseGuards(AuthGuard, PermissionGuard)
    // @ApiBearerAuth()
    @Get()
    findAll(): Promise<ContractEntity[]> {
        return this.contractService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<ContractEntity> {
        return this.contractService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateContractDto: UpdateContractDto,
    ): Promise<ContractEntity> {
        return this.contractService.update(+id, updateContractDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.contractService.remove(+id);
    }
}
