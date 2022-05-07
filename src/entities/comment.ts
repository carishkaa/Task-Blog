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
  
  // children, parent 
  // votes, voteIps

  @CreateDateColumn()
  createdAt: string
}
