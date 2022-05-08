import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Tree,
  TreeChildren,
  OneToMany,
} from 'typeorm'
import { Article } from './article'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  author: string

  @Column('text')
  content: string

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article

  @ManyToOne(() => Comment, (comment) => comment.children)
  parent: Comment

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[]

  @Column({ type: 'int', default: 0 })
  score: number

  @CreateDateColumn()
  createdAt: string
}
