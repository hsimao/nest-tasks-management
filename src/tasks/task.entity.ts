import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TASK_STATUS } from './task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TASK_STATUS;
}
