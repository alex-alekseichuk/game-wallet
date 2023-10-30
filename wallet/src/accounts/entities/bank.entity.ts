import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity()
export class Bank {
  @PrimaryColumn()
  bankId: number;

  @Column()
  balance: number;
}