import {
  Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
