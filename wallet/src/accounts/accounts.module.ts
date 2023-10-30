import { Module, OnApplicationBootstrap } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import {UserWallet} from "./entities/user-wallet.entity";
import {Bank} from "./entities/bank.entity";
import { runInTransaction } from 'typeorm-transactional';

@Module({
  imports: [TypeOrmModule.forFeature([UserWallet, Bank])],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule implements OnApplicationBootstrap {
  constructor(private readonly accountsService: AccountsService) {}

  async onApplicationBootstrap() {
    // await runInTransaction(async () => {
    //   await this.accountsService.createUserWallet(1, 100);
    // });
  }
}
