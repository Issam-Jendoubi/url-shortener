import { ApiProperty } from '@nestjs/swagger'

export class ShortUrlGenerationResultDto {
  @ApiProperty()
  shortUrl: string
}
