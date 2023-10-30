import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserWallet} from "./accounts/entities/user-wallet.entity";
import {Bank} from "./accounts/entities/bank.entity";
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'test',
          password: 'test',
          database: "wallet",
          entities: ["dist/**/*.entity{.ts,.js}"],
          synchronize: true,
          logging: true,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([UserWallet, Bank]),

    AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
