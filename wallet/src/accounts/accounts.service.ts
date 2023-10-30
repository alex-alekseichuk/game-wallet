import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserWallet} from "./entities/user-wallet.entity";
import {Bank} from "./entities/bank.entity";
import { Transactional } from 'typeorm-transactional';

export interface PutAmountToBankRequest {
  userId: number;
  amount: number;
  bankId: number;
}

export enum PutAmountToBankResponse {
  Ok,
  NotEnoughBalance,
  NoUser,
  IncorrectAmount,
}

export interface TakeBankRequest {
  userId: number;
  bankId: number;
}

export enum TakeBankResponse {
  Ok,
  NoBank,
  NoUser,
}

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(UserWallet) private readonly userWalletRepository:Repository<UserWallet>,
    @InjectRepository(Bank) private readonly bankRepository:Repository<Bank>,
  ) {}

  @Transactional()
  public async putAmountToBank({userId, bankId, amount}: PutAmountToBankRequest): Promise<PutAmountToBankResponse> {
    if (isNaN(amount) || amount <= 0) return PutAmountToBankResponse.IncorrectAmount;
    const userWallet: UserWallet = await this.userWalletRepository.findOneBy({userId});
    if (!userWallet) return PutAmountToBankResponse.NoUser;
    if (userWallet.balance  < amount) return PutAmountToBankResponse.NotEnoughBalance;

    let gameAccount: Bank = await this.bankRepository.findOneBy({bankId});
    if (!gameAccount) {
      gameAccount = this.bankRepository.create({bankId, balance: 0});
    }

    gameAccount.balance += amount;
    userWallet.balance -= amount;

    await this.userWalletRepository.save(userWallet);
    await this.bankRepository.save(gameAccount);

    return PutAmountToBankResponse.Ok;
  }

  @Transactional()
  public async takeBank({bankId, userId}: TakeBankRequest): Promise<TakeBankResponse> {
    const userWallet: UserWallet = await this.userWalletRepository.findOneBy({userId});
    if (!userWallet) return TakeBankResponse.NoUser;

    const bank: Bank = await this.bankRepository.findOneBy({bankId});
    if (!bank) return TakeBankResponse.NoBank;

    userWallet.balance += bank.balance;

    await this.userWalletRepository.save(userWallet);
    await this.bankRepository.delete(bank);

    return TakeBankResponse.Ok;
  }

  @Transactional()
  public async createUserWallet(userId: number, balance: number): Promise<PutAmountToBankResponse> {
    const userWallet = this.userWalletRepository.create({userId, balance});
    await this.userWalletRepository.save(userWallet);
    return PutAmountToBankResponse.Ok;
  }
}
