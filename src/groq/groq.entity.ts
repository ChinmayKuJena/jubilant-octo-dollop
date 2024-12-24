import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('groq')
export class GroqEntity {
  @PrimaryGeneratedColumn()
  requestid: string; // Change this to string

  @Column('text')
  request: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  responseid: string;

  @Column('text', { nullable: true })
  response: string;

  @Column('varchar', { length: 255 })
  userid: string; // Change this to string

  @Column('varchar', { length: 255, nullable: true })
  roomid: string;

  @Column('varchar', { length: 255, nullable: true })
  clientid: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdat: Date;
}
