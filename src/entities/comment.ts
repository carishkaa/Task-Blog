import {
  Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
