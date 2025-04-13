import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterUserDto extends CreateUserDto {
  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  @IsString()
  role: string;
}
