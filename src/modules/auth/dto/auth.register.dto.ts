import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString,  MinLength } from "class-validator";

export class RegisterAuthDto {

    @ApiProperty({ description: 'Full name', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ description: 'User email', example: 'hitpitgym04@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'User password', example: '12345678' })
    @MinLength(8)
    @IsNotEmpty()
    password: string;

  
}