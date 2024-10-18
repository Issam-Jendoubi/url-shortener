import {
  Body,
  Controller,
  Get,
  HttpRedirectResponse,
  HttpStatus,
  Param,
  Post,
  Redirect
} from '@nestjs/common'
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiTemporaryRedirectResponse
} from '@nestjs/swagger'
import {
  ShortUrlGenerationPayloadDto,
  ShortUrlGenerationResultDto
} from '../dtos'
import { ShortenerService } from './shortener.service'

@ApiTags('Shortener')
@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post('/shorten')
  @ApiOkResponse({
    status: 201,
    type: ShortUrlGenerationResultDto,
    description: 'The generated short url with its corresponding long url.'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error happens. Error is logged on the server.' })
  async shortenUrl(
    @Body() urlGenerationPayloadDto: ShortUrlGenerationPayloadDto
  ): Promise<ShortUrlGenerationResultDto> {
    return this.shortenerService.createShortUrl(urlGenerationPayloadDto)
  }

  @Get('/redirect/:shortUrl')
  @Redirect()
  @ApiTemporaryRedirectResponse({ status: 301 })
  async redirectToLongUrl(
    @Param('shortUrl') shortUrl: string
  ): Promise<HttpRedirectResponse> {
    const longUrl = await this.shortenerService.getLongUrl(shortUrl)
    if (longUrl) {
      return { statusCode: HttpStatus.MOVED_PERMANENTLY, url: longUrl }
    }
    return { statusCode: HttpStatus.NOT_FOUND, url: shortUrl }
  }
}
