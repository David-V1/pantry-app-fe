import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/Account';
import { Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private url: string = 'http://localhost:8080/account';
  private accountsSubject: Subject<Account[]> = new Subject();
  private accountSubjects: Subject<Account> = new Subject();

  public accounts$: Observable<Account[]> = this.accountsSubject.asObservable();
  public account$: Observable<Account> = this.accountSubjects.asObservable();
  public accounts: Account[] = [];

  constructor(private http: HttpClient) { 
    this.getAllAccounts();
  }

  public getAccounts(): Account[] {
    return this.accounts;
  }

  // C - Create
  public createAccount(account:Account): void {
    this.http.post<Account>(this.url, account)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.getAllAccounts();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  
  // R - Read
  public getAllAccounts(): void {
    this.http.get<Account[]>(this.url)
    .pipe(take(1))
    .subscribe({
      next: accounts => {
        this.accounts = accounts;
        this.accountsSubject.next(accounts);
        
      },
      error: err => console.error(err)
    });
  }

  public whenAccountsUpdate(): Observable<Account[]> {
    return this.accounts$;
  }

  // U - Update

  // D - Delete

}
