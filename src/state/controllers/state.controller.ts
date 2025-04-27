import { StateService } from '../services/state.service';
import { CreateStateDto } from '../dto/create-state.dto';
import { UpdateStateDto } from '../dto/update-state.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('states')
export class StateController {
    constructor(private readonly stateService: StateService) {}

    @Post()
    create(@Body() createStateDto: CreateStateDto) {
        return this.stateService.create(createStateDto);
    }

    @Get()
    findAll() {
        return this.stateService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stateService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
        return this.stateService.update(+id, updateStateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.stateService.remove(+id);
    }

    @Post('upload-excel')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcel(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        // Asumiendo que el userId viene en el token JWT
        const userId = req.user['id'];
        return this.stateService.processExcelFile(file, userId);
    }
}
