import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import {Bet, Game} from "./game/entities/game.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'test',
          password: 'test',
          database: "game",
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
    TypeOrmModule.forFeature([Game, Bet]),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
