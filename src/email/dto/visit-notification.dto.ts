import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsOptional, ValidateNested, IsDateString } from 'class-validator';


class VisitDataDto {
    @IsNotEmpty()
    @IsString()
    clientName: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    endDate: string;

    @IsNotEmpty()
    @IsString()
    propertyAddress: string;

    @IsNotEmpty()
    @IsString()
    agentName: string;

    @IsNotEmpty()
    @IsString()
    clientPhone: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class VisitNotificationDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email debe tener un formato válido' })
    to: string;

    @ValidateNested()
    @Type(() => VisitDataDto)
    visitData: VisitDataDto;
}