import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { scryptHash } from '~/utils/hashers'

@Entity()
export class User {
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await scryptHash(this.password)
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string

  @Column({ type: 'varchar', select: false})
  password: string
}
