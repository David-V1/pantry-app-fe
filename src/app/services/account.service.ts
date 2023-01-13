import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/Account';
import { Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private url: string = 'http://localhost:8080/account';
  private accountSubject: Subject<Account> = new Subject();
  public account$: Observable<Account> = this.accountSubject.asObservable();
  public accounts: Account[] = [];

  constructor(private http: HttpClient) { }

  // C
  public createAccount(account:Account): void {
    this.http.post(this.url, account)
    .pipe(take(1))
    .subscribe({
      next: account => {
        console.log(account);
      },
      error: err => {
        console.log(err);
      }
    });
  }
  // R
  // U
  // D

}
