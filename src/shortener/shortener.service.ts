import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto'
import { Repository } from 'typeorm'
import {
  ShortUrlGenerationPayloadDto,
  ShortUrlGenerationResultDto
} from '../dtos'
import { UrlMapping } from '../entities'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ShortenerService {
  ALGORITHM: string
  ENCRYPTION_KEY: string
  logger = new Logger()

  constructor(
    @InjectRepository(UrlMapping)
    private urlMappingRepository: Repository<UrlMapping>,
    private readonly configService: ConfigService
  ) {
    this.ALGORITHM = 'aes-256-cbc'
    this.ENCRYPTION_KEY = this.configService.get('ENCRYPTION_KEY')
  }

  async createShortUrl(
    urlGenerationDto: ShortUrlGenerationPayloadDto
  ): Promise<ShortUrlGenerationResultDto> {
    try {
      let generatedShortUrl: string
      do {
        generatedShortUrl = this.generateShortUrl(urlGenerationDto.longUrl)
      } while (
        await this.urlMappingRepository.findOne({
          where: { shortUrl: generatedShortUrl }
        })
      )
      const urlGenerationResultDto: ShortUrlGenerationResultDto = {
        shortUrl: generatedShortUrl
      }
      await this.saveUrlMapping(
        new UrlMapping({
          ...urlGenerationResultDto,
          longUrl: urlGenerationDto.longUrl
        })
      )
      return urlGenerationResultDto
    } catch (error) {
      this.logger.error(
        `An error while generating short url for ${urlGenerationDto.longUrl}`,
        error
      )
      throw new InternalServerErrorException(
        'An error happened when generating a short url'
      )
    }
  }

  generateShortUrl(longUrl: string): string {
    const uniqueUUID = crypto.randomUUID()
    const combinedUrlWithUUID = `${longUrl}-${uniqueUUID}`
    const hash = crypto
      .createHash('md5')
      .update(combinedUrlWithUUID)
      .digest('hex')
    return hash.substring(0, 10)
  }

  async saveUrlMapping(urlMapping: UrlMapping): Promise<void> {
    let encryptedLongUrl: string
    do {
      encryptedLongUrl = this.encryptUrl(urlMapping.longUrl)
    } while (
      await this.urlMappingRepository.findOne({
        where: { longUrl: encryptedLongUrl }
      })
    )
    await this.urlMappingRepository.save({
      ...urlMapping,
      longUrl: encryptedLongUrl
    })
  }

  encryptUrl(longUrl: string): string {
    const initialVector = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(
      this.ALGORITHM,
      Buffer.from(this.ENCRYPTION_KEY),
      initialVector
    )
    let encryptedUrl = cipher.update(longUrl, 'utf8', 'hex')
    encryptedUrl += cipher.final('hex')
    return initialVector.toString('hex') + ':' + encryptedUrl
  }

  async getLongUrl(shortUrl: string): Promise<string | null> {
    try {
      const urlMapping = await this.urlMappingRepository.findOne({
        where: { shortUrl }
      })
      return urlMapping?.longUrl ? this.decryptUrl(urlMapping?.longUrl) : null
    } catch (error) {
      this.logger.error(`An error while redirecting ${shortUrl}`, error)
      return null
    }
  }

  decryptUrl(encryptedUrl: string): string {
    const parts = encryptedUrl.split(':')
    const initialVector = Buffer.from(parts.shift(), 'hex')
    const encryptedTextBuffer = Buffer.from(parts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      Buffer.from(this.ENCRYPTION_KEY),
      initialVector
    )
    let decryptedUrl = decipher.update(
      encryptedTextBuffer as any as string,
      'binary',
      'utf8'
    )
    decryptedUrl += decipher.final('utf8')
    return decryptedUrl
  }
}
