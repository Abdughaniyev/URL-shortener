import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsDateString } from 'class-validator';

export class CreateUrlDto {
    @ApiProperty({ description: 'Original URL', example: 'https://example.com' })
    @IsString()
    @IsNotEmpty()
    @IsUrl({}, { message: 'Invalid URL format' })
    originalUrl: string;

    @ApiPropertyOptional({ description: 'Expiration date (optional)', example: '2025-12-31T23:59:59.000Z' })
    @IsOptional()
    @IsDateString({}, { message: 'expiresAt must be a valid ISO date string' })
    expiresAt?: string;
}
