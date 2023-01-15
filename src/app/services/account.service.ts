import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/Account';
import { Observable, Subject, take } from 'rxjs';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public currentAccount = {} as Account;
  
  private url: string = 'http://localhost:8080/account';
  private accountsSubject: Subject<Account[]> = new Subject();
  private accountSubjects: Subject<Account> = new Subject();

  public accounts$: Observable<Account[]> = this.accountsSubject.asObservable();
  public account$: Observable<Account> = this.accountSubjects.asObservable();
  public accounts: Account[] = [];

  constructor(private http: HttpClient, public ui: UiService) { 
    this.getAllAccounts();
    
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email && password) {this.getAccount(email, password) }
    
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
      error: err => this.ui.onError('Unavailable to return all accounts: ' + err)
    });
  }

  public getAccount(email: string, password: string): void {
    this.http.get<Account>(`${this.url}?email=${email}&password=${password}`)
    .pipe(take(1))
    .subscribe({
      next: account => {
        this.currentAccount = account;
        this.ui.onValidLogin(this.currentAccount);
        this.accountSubjects.next(account);
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
