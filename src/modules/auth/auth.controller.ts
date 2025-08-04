import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/auth.register.dto";
import { LoginAuthDto } from "./dto/auth.login.dto";
import { RefreshTokenDto } from "./dto/refresh.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterAuthDto) {
        return this.authService.register(dto)
    }

    @Post('login')
    login(@Body() dto: LoginAuthDto) {
        return this.authService.login(dto)
    }

    @Post('refresh-token')
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refresh(dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token') 
    @Post('logout')
     logout(@Body() dto: RefreshTokenDto) {
        return this.authService.logout(dto);
    }

}