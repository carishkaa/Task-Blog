import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { Article } from './article';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  author: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article
  
  // TODO children, parent 

  @Column({type: 'int', default: 0})
  score: number

  @CreateDateColumn()
  createdAt: string
}
