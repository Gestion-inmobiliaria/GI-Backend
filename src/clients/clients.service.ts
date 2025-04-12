import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEntity } from './entities/client.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handlerError.utils';



@Injectable()
export class ClientsService {
  private readonly logger = new Logger('ClientsService');

  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  public async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    try {
      const { ...clientData } = createClientDto;

      const client = this.clientRepository.create({
        ...clientData,
      });

      return await this.clientRepository.save(client);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.clientRepository.createQueryBuilder('client');
      query.leftJoinAndSelect('client.inmobiliaria', 'inmobiliaria');

      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('client.name', order.toUpperCase() as any);
      if (attr && value)
        query.andWhere(`client.${attr} ILIKE :value`, { value: `%${value}%` });

      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<ClientEntity> {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
        relations: ['inmobiliaria'],
      });
      if (!client) throw new NotFoundException('Cliente no encontrado.');
      return client;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    try {
      const { ...clientData } = updateClientDto;
      const client = await this.findOne(id);

      Object.assign(client, clientData);

      const updatedClient = await this.clientRepository.save(client);
      return updatedClient;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<ResponseMessage> {
    try {
      const client = await this.findOne(id);
      const result = await this.clientRepository.remove(client);
      if (!result) throw new BadRequestException('El cliente no se pudo eliminar.');
      return { statusCode: 200, message: 'Cliente eliminado correctamente.' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
