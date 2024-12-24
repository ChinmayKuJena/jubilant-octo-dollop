import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('socketdata')
export class SocketDataEntity {
  @PrimaryColumn('varchar', { length: 255 })
  roomid: string;

  @Column('varchar', { length: 255, nullable: true })
  clientid: string;

  @Column('int')
  userid: number;

  @Column('varchar', { length: 255, nullable: true })
  username: string;
}
