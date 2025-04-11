import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateInmobiliariasDto{
 @IsNotEmpty()
 @IsString()
 @MaxLength(100)
 nombre: string;
 
 @IsNotEmpty()
 @IsEmail()
 email: string;

 @IsNotEmpty()
 @IsString()
 @MaxLength(255)
 direccion: string;
}