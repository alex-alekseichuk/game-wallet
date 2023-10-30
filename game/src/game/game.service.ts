import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Transactional} from 'typeorm-transactional';
import {Bet, Game, GameStatus} from "./entities/game.entity";
import {AccountsService} from "./accounts.service";

const BET_AMOUNT: number = 2;
const GAME_ID: number = 1;

const BETTING_PERIOD = 5_000;
const WAITING_PERIOD = 1_000;

export interface MakeBetRequest {
  userId: number;
}

export class GameError extends Error {}

@Injectable()
export class GameService {
  private game: Game;

  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(Bet) private readonly betRepository: Repository<Bet>,
    private readonly accountsService: AccountsService,
  ) {
    this.loadGame().then(() => {});
  }

  @Transactional()
  public async loadGame() {
    this.game = await this.gameRepository.findOne({where: {id: GAME_ID}, relations: ['bets']});
    if (!this.game) {
      this.game = this.gameRepository.create({id: GAME_ID, status: GameStatus.INIT, bets: []});
      this.gameRepository.save(this.game);
    }
    switch (this.game.status) {
      case GameStatus.BETTING:
        setTimeout(() => this.noMoreBets(), BETTING_PERIOD);
        break;
      case GameStatus.WAITING:
        setTimeout(() => this.finishGame(), WAITING_PERIOD);
        break;
      case GameStatus.RESULT:
        await this.awardWinner();
        break;
    }
  }

  @Transactional()
  public async makeBet({userId}: MakeBetRequest): Promise<boolean> {
    console.log('makeBet');
    if (!this.game) return;

    if (this.game.status !== GameStatus.INIT && this.game.status !== GameStatus.BETTING)
      return false;

    await this.accountsService.putAmountToBank({userId, bankId: GAME_ID, amount: BET_AMOUNT});

    const bet = this.betRepository.create({userId});
    this.game.bets.push(bet);

    if (this.game.status === GameStatus.INIT) {
      this.game.status = GameStatus.BETTING;
      setTimeout(() => this.noMoreBets(), BETTING_PERIOD);
    }

    await this.betRepository.save(bet);
    await this.gameRepository.save(this.game);

    return true;
  }

  @Transactional()
  private async noMoreBets() {
    console.log('noMoreBets');
    if (!this.game) return;
    this.game.status = GameStatus.WAITING;
    await this.gameRepository.save(this.game);
    setTimeout(() => this.finishGame(), WAITING_PERIOD);
  }

  private async finishGame() {
    console.log('finishGame');
    await this.chooseWinner();
    await this.awardWinner();
  }

  @Transactional()
  private async chooseWinner() {
    console.log('chooseWinner');
    if (!this.game) return;
    this.game.winnerId = 1; // TODO: choose random winner
    await Promise.all(this.game.bets.map(bet => this.betRepository.remove(bet)));
    this.game.bets = [];
    this.game.status = GameStatus.RESULT;
    await this.gameRepository.save(this.game);
  }

  @Transactional()
  private async awardWinner() {
    console.log('awardWinner');
    if (!this.game) return;

    await this.accountsService.takeBank({userId: this.game.winnerId, bankId: GAME_ID});

    this.game.status = GameStatus.INIT;
    await this.gameRepository.save(this.game);
  }
}
