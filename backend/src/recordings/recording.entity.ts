import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Recording {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  lessonId: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @Column('int')
  durationMs: number;

  @CreateDateColumn()
  createdAt: Date;
}
