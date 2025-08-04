import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url, UrlDocument } from './schema/url.schema';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ResData } from 'src/common/response-data/ResData';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name)
    private readonly urlModel: Model<UrlDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }


  async shorten(dto: CreateUrlDto, user: JwtPayload) {
    const { originalUrl, expiresAt } = dto;
    const shortCode = nanoid(6);

    const newUrl = await this.urlModel.create({
      originalUrl,
      shortCode,
      userId: user.sub,
      expiresAt,
    });

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    return new ResData('Short URL has been created', 201, { shortUrl, shortCode });
  }


  async redirect(shortCode: string): Promise<string> {

    const cached = await this.cacheManager.get<string>(shortCode);
    const ttl = Number(process.env.REDIS_TTL) || 86400
    if (cached) {
      return cached;
    }

    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new NotFoundException('Short URL not found');

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      throw new NotFoundException('This URL has expired');
    }

    url.visits += 1;
    await url.save();
    await this.cacheManager.set(shortCode, url.originalUrl, ttl);
    return url.originalUrl
  }


  async getStats(shortCode: string, user: JwtPayload) {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new NotFoundException('URL not found');

    if (url.userId.toString() !== user.sub) {
      throw new ForbiddenException('You do not own this URL');
    }

    return new ResData('Stats retrieved', 200, {
      originalUrl: url.originalUrl,
      visits: url.visits,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    });
  }
}
