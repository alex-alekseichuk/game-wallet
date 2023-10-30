import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';

export enum GameStatus {
  INIT = 'init',
  BETTING = 'betting',
  WAITING = 'waiting',
  RESULT = 'result',
}

@Entity()
export class Game {
  @PrimaryColumn()
  id: number;

  @Column('enum', { enum: GameStatus })
  status: GameStatus = GameStatus.INIT;

  @Column({nullable: true})
  winnerId: number|null;

  @OneToMany(() => Bet, (bet) => bet.game, { cascade: true })
  bets: Bet[];
}

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Game, (game) => game.bets, { onDelete: 'CASCADE' })
  game: Game;
}
