import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PaymentMethodService } from '../services/payment_method.service';
import { PAYMENTMETHOD } from '../entities/payment_method.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('payment-method')
@ApiTags('payment-method')
export class PaymentMethodController {
  constructor(private readonly service: PaymentMethodService) {}

  @Post()
  async create(@Body('name') name: PAYMENTMETHOD) {
    if (!Object.values(PAYMENTMETHOD).includes(name)) {
      throw new NotFoundException('Método de pago inválido');
    }
    return this.service.create(name);
  }

  @Get()
  async findAll() {
    return this.service.findAll({
      limit: 100,
      offset: 0,
      order: 'ASC',
      attr: undefined,
      value: undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    if (!result) throw new NotFoundException('Método de pago no encontrado');
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const method = await this.service.findOne(id);
    if (!method) throw new NotFoundException('No existe el método');
    await this.service.delete(id);
    return { message: 'Método de pago eliminado' };
  }
}
