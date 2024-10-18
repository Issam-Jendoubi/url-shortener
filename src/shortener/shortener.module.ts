import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UrlMapping } from '../entities'
import { ShortenerController } from './shortener.controller'
import { ShortenerService } from './shortener.service'

@Module({
  imports: [TypeOrmModule.forFeature([UrlMapping])],
  providers: [ShortenerService],
  controllers: [ShortenerController]
})
export class ShortenerModule {}
