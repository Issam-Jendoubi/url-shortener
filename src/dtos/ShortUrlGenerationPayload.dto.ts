import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator'

export class ShortUrlGenerationPayloadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl({ protocols: ['http', 'https'], allow_trailing_dot: true, allow_underscores: true })
  @MaxLength(1000)
  longUrl: string
}
