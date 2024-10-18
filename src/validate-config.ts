import { plainToClass } from 'class-transformer'
import { IsNotEmpty, IsString, Length, validateSync } from 'class-validator'

export class Configuration {
  // Must be 32 characters for AES-256 (multiple of 16 bytes)
  @IsString() @IsNotEmpty() @Length(32) ENCRYPTION_KEY: string
}

export function validate(config: Record<string, unknown>): Configuration {
  const validatedConfig = plainToClass(Configuration, config, {
    enableImplicitConversion: true
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  })

  if (errors.length > 0) throw new Error(errors.toString())
  return validatedConfig
}
