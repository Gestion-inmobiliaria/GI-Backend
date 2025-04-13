import { ApiProperty } from '@nestjs/swagger';
import { IAuth } from '../interfaces/auth.interface';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';



export class AuthDTO implements IAuth {
    @ApiProperty({
        example: 'adminTI@gmail.com',
        type: String,
        description: 'Correo electrónico',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '12345678',
        type: String,
        description: 'Contraseña del usuario',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
