import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateInmobiliariasDto} from '../dto/create-inmobiliarias.dto';
import { UpdateInmobiliariasDto} from '../dto/update-inmobiliarias.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils';
import { ResponseMessage } from 'src/common/interfaces/responseMessage.interface';
import { InmobiliariaEntity } from "../entity/inmobiliarias.entity";

@Injectable()
export class InmobiliariaService {
 
 private readonly logger = new Logger('InmobiliariasService');

 constructor(@InjectRepository(InmobiliariaEntity)private readonly inmobiliariasRepository: Repository<InmobiliariaEntity>){}


 public async create(inmobiliarias: CreateInmobiliariasDto): Promise<ResponseMessage>{
  try{  
   const newInmobiliarias = this.inmobiliariasRepository.create(inmobiliarias);  
   await this.inmobiliariasRepository.save(newInmobiliarias);
   return {
     message: 'Inmobiliaria creada correctamente',
     statusCode: 201,
     data: newInmobiliarias
   };
  }catch(error){
    handlerError(error,this.logger); 
   }
 }

 public async findAll(queryDto: QueryDto): Promise<ResponseMessage> {
     try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.inmobiliariasRepository.createQueryBuilder('inmobiliaria').where('eliminado=false');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('nombre', order.toLocaleUpperCase() as any);
      if (attr && value) {
        query.andWhere(`inmobiliaria.${attr} ILIKE :value`, { value: `%${value}%` });
      }
      const result = await query.getMany();

       return {
        message: 'Inmobiliarias obtenidas correctamente',
        statusCode: 200, 
        data: result,
     };
     } catch (error) {
       handlerError(error, this.logger);
     }
   }
 
   public async findOne(id: string): Promise<ResponseMessage> {
     try {
      const inmobiliaria = await this.inmobiliariasRepository.findOneBy({ id, eliminado: false });
      if(!inmobiliaria){
       throw new NotFoundException('Inmobiliaria no encontrada.');
      }  
      return{
        message: 'Inmobiliaria encontrada correctamente',
        statusCode: 200, 
        data: inmobiliaria
       };
     } catch (error) {
       handlerError(error, this.logger);
     }
   }
 
   public async update(
     id: string,
     UpdateInmobiliariasDto: UpdateInmobiliariasDto
    ): Promise<ResponseMessage> {

     try {
      const inmobiliariaUpdate = await this.inmobiliariasRepository.findOneBy({id, eliminado: false });
      if (!inmobiliariaUpdate) {
        throw new NotFoundException('Inmobiliaria no encontrada.');
      }
      const result = await this.inmobiliariasRepository.update(id, UpdateInmobiliariasDto);

      if(result.affected === 0){
        throw new BadRequestException('no se pudo realizar cambios.');
      }

      return {
        message: 'Inmobiliaria actualizada correctamente',
        statusCode: 200,
      }

     } catch (error) {
       handlerError(error, this.logger);
     }
   }
 
   public async remove(id: string): Promise<ResponseMessage> {
     try {
      const inmobiliaria = await this.inmobiliariasRepository.findOneBy({ id, eliminado: false });      
      if (!inmobiliaria) {
        throw new NotFoundException('Inmobiliaria no encontrada.');
      }
      const inmobiliariaDelete = await this.inmobiliariasRepository.update(inmobiliaria.id, {eliminado: true});

      if(inmobiliariaDelete.affected === 0){
        throw new BadRequestException('La inmobiliaria no se ha podido eliminar');
      }
       return {
         message: 'inmobiliaria eliminada correctamente',
         statusCode: 200,
       };
     } catch (error) {
       handlerError(error, this.logger);
     }
   }
} 