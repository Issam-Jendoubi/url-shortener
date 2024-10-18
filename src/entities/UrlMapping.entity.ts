import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('urls_mappings')
export class UrlMapping {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    name: 'long_url',
    nullable: false,
    length: 2100
  })
  longUrl: string

  @Column('varchar', {
    name: 'short_url',
    nullable: false,
    length: 10,
    unique: true
  })
  shortUrl: string

  constructor(init?: Partial<UrlMapping>) {
    Object.assign(this, init)
  }
}
