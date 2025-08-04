import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {

    @ApiProperty({ description: 'User email', example: 'hitpitgym04@gmail.com' })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'User password', example: '12345678' })
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    password: string;
}