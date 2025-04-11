import { PartialType } from '@nestjs/mapped-types';
import { CreateInmobiliariasDto} from '../dto/create-inmobiliarias.dto';


export class UpdateInmobiliariasDto extends PartialType(CreateInmobiliariasDto){
}