import { Controller, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  AccountsService,
  PutAmountToBankRequest,
  PutAmountToBankResponse,
  TakeBankRequest,
  TakeBankResponse
} from "./accounts.service";

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService
  ) {}

  @Post('putAmountToBank')
  async putAmountToBank(
    @Body() request: PutAmountToBankRequest,
  ) {
    const result = await this.accountsService.putAmountToBank(request);
    switch (result) {
      case PutAmountToBankResponse.NoUser:
        throw new NotFoundException('No such User');
      case PutAmountToBankResponse.IncorrectAmount:
      case PutAmountToBankResponse.NotEnoughBalance:
        throw new BadRequestException('No such User');
    }
  }

  @Post('takeBank')
  async takeBank(
    @Body() request: TakeBankRequest,
  ) {
    const result = await this.accountsService.takeBank(request);
    switch (result) {
      case TakeBankResponse.NoUser:
        throw new NotFoundException('No such User');
      case TakeBankResponse.NoBank:
        throw new NotFoundException('No such Bank');
    }
  }
}
