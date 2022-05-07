import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Comment } from './comment';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 100})
  title: string;

  @Column('text')
  perex: string;

  @Column('text')
  content: string;

  @OneToMany(() => Comment, (comment) => (comment.article))
  comments: Comment

  @CreateDateColumn()
  createdAt: string
}
