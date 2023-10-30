import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity()
export class UserWallet {
  @PrimaryColumn()
  userId: number;

  @Column()
  balance: number;
}