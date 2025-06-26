export class EmailResponseDto {
    success: boolean;
    message: string;
    statusCode: number;
    error?: string;
}