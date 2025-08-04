import { Controller, Get, Post, Body, Param, UseGuards, Req, Res, Query } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/common/interfaces/auth-request';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';

@ApiTags('URL')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('shorten')
  shorten(@Body() createUrlDto: CreateUrlDto, @Req() req: AuthRequest) {
    const user = req.user;
    return this.urlService.shorten(createUrlDto, user);
  }




  @Get(':shortCode')
  @ApiOperation({ summary: 'Get original URL from short code' })
  @ApiResponse({ status: 200, description: 'Original URL returned' })
  async redirect(
    @Param('shortCode') shortCode: string,
    @Query('raw') raw: string,
    @Res({ passthrough: true }) res: Response) {

    const originalUrl = await this.urlService.redirect(shortCode);

    if (raw === 'true') {
      return { message: 'Redirect target retrieved', originalUrl };
    }

    return res.redirect(originalUrl);
  }



  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('stats/:shortCode')
  getStats(@Param('shortCode') shortCode: string, @Req() req: AuthRequest) {
    const user = req.user
    return this.urlService.getStats(shortCode, user);
  }

}
