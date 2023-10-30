import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Bet, Game} from "./entities/game.entity";
import {AccountsService} from "./accounts.service";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Game, Bet])],
  controllers: [GameController],
  providers: [AccountsService, GameService]
})
export class GameModule {}
