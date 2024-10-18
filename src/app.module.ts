import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UrlMapping } from './entities'
import { ShortenerModule } from './shortener'
import { ConfigModule } from '@nestjs/config'
import { validate } from './validate-config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['configuration/encryption.env'],
      validate,
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'url_shortener',
      entities: [UrlMapping],
      synchronize: true
    }),
    ShortenerModule
  ]
})
export class AppModule {}
