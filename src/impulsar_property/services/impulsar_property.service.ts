import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable,Logger, NotFoundException} from '@nestjs/common';
import { CreateImpulsarPropertyDto } from '../dto/create-impulsar_property.dto';
import { UpdateImpulsarPropertyDto } from '../dto/update-impulsar_property.dto';
import { ImpulsarProperty, ImpulsoStatus } from '../entities/impulsar_property.entity';
import { ResponseGet, ResponseMessage } from '@/common/interfaces';
import { PropertyService } from '@/property/services/property.service';
import { UserService } from '@/users/services/users.service';
import { QueryDto } from '@/common/dto/query.dto';
import { handlerError } from '@/common/utils';
import { CancelImpulsarPropertyDto } from '../dto/create-cancelar_impulso.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ImpulsarPropertyService {
  private readonly logger = new Logger('ImpulsarPropertyService');

  constructor(
   @InjectRepository(ImpulsarProperty) 
   private readonly impulsarPropertyRepository: Repository<ImpulsarProperty>,
   private readonly propertyService: PropertyService,
   private readonly userService: UserService,
  ){}

  public async create(createImpulsarPropertyDto: CreateImpulsarPropertyDto): Promise<ResponseMessage> {
   try{
    const {user, property,...ImpulsarProperty} = createImpulsarPropertyDto;
    const userFound = await this.userService.findOne(user);
    const propertyFound = await this.propertyService.findOne(property);
    const newImpulso = this.impulsarPropertyRepository.create({
      ...ImpulsarProperty,
      user: userFound,
      property: propertyFound,
    });
     const createdImpulso = await this.impulsarPropertyRepository.save(newImpulso);
     return {
       statusCode: 201,
       data: createdImpulso,
     }
   }catch(error){
     this.logger.error('Error al crear el impulso', error);
     throw error;
   } 
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try{
     const { limit, offset, order, attr, value } = queryDto;
     const query= this.impulsarPropertyRepository.createQueryBuilder('impulsos')
     .leftJoinAndSelect('impulsos.user', 'user')
     .leftJoinAndSelect('impulsos.property', 'property');

     if (limit) query.take(limit);
     if (offset) query.skip(offset);
     if (order) query.orderBy('impulsos.createdAt', order.toUpperCase() as 'ASC' | 'DESC');

     const allowedAttrs = ['status', 'razonAImpulsar', 'razonACancelar', 'startDate', 'endDate'];
     if (attr && value && allowedAttrs.includes(attr)) {
      if (['startDate', 'endDate'].includes(attr)) {
       query.andWhere(`impulsos.${attr} = :value`, { value });
      } else {
       query.andWhere(`impulsos.${attr} ILIKE :value`, { value: `%${value}%` });
      }
    }

     const [data, countData] = await query.getManyAndCount();
     return {
       data,
       countData,
      };
    } catch (error) {
     this.logger.error('Error al obtener los impulso', error);
     throw error;
    }
  }

  public async findOne(id: string): Promise<ImpulsarProperty> {
   try{
    const impulso= await this.impulsarPropertyRepository.findOne({
      where: {id},
      relations: ['user', 'property'],
    });

    if(!impulso){
     throw new NotFoundException(`Impulso con ID ${id} no encontrado`);
    }

    return impulso;

   }catch(error){
     handlerError(error, this.logger);
     throw error;
   } 
  }

  public async update(id: string, updateImpulsarPropertyDto: UpdateImpulsarPropertyDto):Promise<ResponseMessage>{
   try{
    const impulso = await this.findOne(id);

    if (impulso.status === ImpulsoStatus.CANCELADO) {
      throw new BadRequestException('No se puede actualizar un impulso cancelado.');
    }

    if (impulso.status === ImpulsoStatus.EXPIRADO) {
      throw new BadRequestException('No se puede actualizar un impulso expirado.');
    }

    const {user,property,...rest}= updateImpulsarPropertyDto;
    if(user){
     const userFound = await this.userService.findOne(user);
     impulso.user = userFound; 
    }

    if(property){
     const propertyFound = await this.propertyService.findOne(property);
     impulso.property = propertyFound;
    } 

    Object.assign(impulso,rest);
    const result = await this.impulsarPropertyRepository.save(impulso);

    return {
      statusCode: 200,
      data: result,
    };

   }catch(error){  
    handlerError(error, this.logger);
   }  
  }

  public async cancelarImpulso(id:string, CancelImpulsarPropertyDto: CancelImpulsarPropertyDto):Promise<ResponseMessage>{
   try{
    const impulso = await this.findOne(id);

    if(!impulso){
      return {
       statusCode: 404,
       message: 'Impulso no encontrado',
      };
    }
    
    if(impulso.status === ImpulsoStatus.CANCELADO){
      return {
       statusCode: 400,
        message: 'El impulso ya ha sido cancelado', 
      };
    }
    
    if(impulso.status === ImpulsoStatus.EXPIRADO){
      return {
       statusCode: 400,
        message: 'El impulso ya ha expirado',
      };
    }

    impulso.status = ImpulsoStatus.CANCELADO;
    impulso.razonACancelar = CancelImpulsarPropertyDto.razonACancelar;
    impulso.cancelled_at = new Date();

    const impulsoActualizado = await this.impulsarPropertyRepository.save(impulso);

    return {
     statusCode: 200,
     data: impulsoActualizado, 
    };

   }catch(error){
     this.logger.error('Error al cancelar el impulso', error);
     throw error;
   }
  }

 @Cron(CronExpression.EVERY_5_MINUTES) 
 public async expirarImpulso(): Promise<void> {
  try {
    const now = new Date();

    const impulsosActivos = await this.impulsarPropertyRepository.find({
      where: { status: ImpulsoStatus.ACTIVO },
    });

    const expirados = impulsosActivos.filter(i => i.endDate < now);

    if (expirados.length === 0) {
      this.logger.log('No hay impulsos por expirar');
      return;
    }

    for (const impulso of expirados) {
      impulso.status = ImpulsoStatus.EXPIRADO;
    }

    await this.impulsarPropertyRepository.save(expirados);

    this.logger.log(`${expirados.length} impulsos expirados correctamente`);
  } catch (error) {
    this.logger.error('Error al expirar los impulsos', error);
    throw error;
  }
}


   public async remove(id: string):Promise<ResponseMessage> {
    try{
     const impulso = await this.findOne(id);
     
     if(!impulso){
      return {
       statusCode: 404,
       message: 'Impulso no encontrado',
      };
     }

     await this.impulsarPropertyRepository.remove(impulso);

     return{
       statusCode: 200,
       message: `Impulso eliminado correctamente`,
      }

    }catch(error){
      this.logger.error('Error al eliminar el impulso', error);
      throw error;
    }
  }
}