import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {catchError, firstValueFrom} from 'rxjs';

export class WalletError extends Error {}

@Injectable()
export class AccountsService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  public async putAmountToBank(request: {userId: number, bankId: number, amount: number}) {
    await firstValueFrom(
      this.httpService.post('http://localhost:3001/accounts/putAmountToBank',
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError(() => {
            throw new WalletError("Can't make a bet");
          }),
        ),
    );
  }

  public async takeBank(request: {userId: number, bankId: number}) {
    await firstValueFrom(
      this.httpService.post('http://localhost:3001/accounts/takeBank',
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError(() => {
            throw new WalletError("Can't take bank");
          }),
        ),
    );
  }
}
