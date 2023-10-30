import {Body, Controller, Post} from '@nestjs/common';
import {GameService, MakeBetRequest} from "./game.service";

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('makeBet')
  makeBet(@Body() request: MakeBetRequest) {
    return this.gameService.makeBet(request);
  }
}
