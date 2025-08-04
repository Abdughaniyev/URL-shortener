import { InjectModel } from "@nestjs/mongoose";
import { Auth, AuthDocument } from "./schema/auth.schema";
import { Model } from "mongoose";
import { RegisterAuthDto } from "./dto/auth.register.dto";
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { ResData } from "src/common/response-data/ResData";
import { LoginAuthDto } from "./dto/auth.login.dto";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from "./dto/refresh.dto";
export class AuthService {
    constructor(@InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
        private readonly jwtService: JwtService,
    ) { }


    async register(dto: RegisterAuthDto) {
        const { email, password, fullName } = dto;

        const isUserExist = await this.authModel.findOne({ email })
        if (isUserExist) throw new ConflictException('User already exists!')

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await this.authModel.create({
            fullName,
            email,
            password: hashedPassword,
        })
 
         const { password:_, ...rest } = newUser.toObject()

        return new ResData('User has been created successfully!', 201, rest)
    }

    async login(dto: LoginAuthDto) {
        const { email, password } = dto
        const user = await this.authModel.findOne({ email })
        if (!user) throw new NotFoundException('No user found!')

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) throw new UnauthorizedException('Invalid password!')

        const payload: JwtPayload = {
            sub: user._id.toString(),
            email: user.email,
        }

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.ACCESSTOKEN,
            expiresIn: '15m',
        })
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESHTOKEN,
            expiresIn: '7d'
        })

        user.refreshTokens?.push(refreshToken)
        await user.save();

        const { password: _, ...rest } = user.toObject()
        return new ResData('Log in successful!', 200, { user: rest, accessToken, refreshToken })
    }

    async refresh(dto: RefreshTokenDto) {
        const { refreshToken } = dto;


        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: process.env.REFRESHTOKEN,
            });
        }
        catch (err) {

            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token expired');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.authModel.findById(payload.sub);
        if (!user || !user.refreshTokens?.includes(refreshToken)) {
            throw new UnauthorizedException('Refresh token not found or invalid')
        }

        const newPayload: JwtPayload = {
            sub: user._id.toString(),
            email: user.email,
        }


        const newAccessToken = this.jwtService.sign(newPayload, {
            secret: process.env.ACCESSTOKEN,
            expiresIn: '15m',
        });

        const newRefreshToken = this.jwtService.sign(newPayload, {
            secret: process.env.REFRESHTOKEN,
            expiresIn: '7d',
        });


        user.refreshTokens = (user.refreshTokens ?? []).filter((token) => token !== refreshToken);
        user.refreshTokens.push(newRefreshToken)
        await user.save();

        
        return new ResData('Token refreshed successfully', 200, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }

    async logout(dto: RefreshTokenDto) {
        const { refreshToken } = dto;
        const user = await this.authModel.findOne({ refreshTokens: refreshToken })
        if (!user) throw new UnauthorizedException('Invalid refresh token');

        user.refreshTokens = (user.refreshTokens ?? []).filter(token => token !== refreshToken);
        await user.save();

        return new ResData('Logged out successfully', 200);
    }


}