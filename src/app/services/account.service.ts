import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/Account';
import { Observable, Subject, take, BehaviorSubject, catchError, throwError } from 'rxjs';
import { UiService } from './ui.service';
import { PageName } from '../enums/PageEnum';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public currentAccount = {} as Account;
  public pageName = PageName;
  
  private url: string = 'http://localhost:8080/account';
  private accountsSubject: Subject<Account[]> = new Subject();
  private accountSubject: BehaviorSubject<Account> = new BehaviorSubject(this.currentAccount);

  public accounts$: Observable<Account[]> = this.accountsSubject.asObservable();
  public account$: Observable<Account> = this.accountSubject.asObservable();
  public accounts: Account[] = [];

  constructor(private http: HttpClient, public ui: UiService) { 
    this.getAllAccounts();
    
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email !== null && password !== null) {
      this.persistUserAccount(email, password);
    }
    
  }

  public getAccounts(): Account[] {
    return this.accounts;
  }

  // C - Create
  public createAccount(account:Account): void {
    this.http.post<Account>(this.url, account)
    .pipe(take(1))
    .subscribe({
      next: account => {
        this.accountSubject.next(account)
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
        console.log('subscribe => account: ',account)
        this.currentAccount = account;
        this.ui.onValidLogin(this.currentAccount);
        this.accountSubject.next(account);
        this.ui.changePage(this.pageName.HOME)
        
      },
      error: err => {
        console.error(err)
        return;
      }
    });
  }

  private persistUserAccount(email:string, password:string): void {
    this.http.get<Account>(`${this.url}?email=${email}&password=${password}`)
    .pipe(take(1),
    catchError(() => {
      return throwError(() => new Error('oops, something happened'));
    }))
    .subscribe( account => {
      this.currentAccount = account
      this.accountSubject.next(account)
      console.log(this.currentAccount)
    })
  }

  public whenAccountsUpdate(): Observable<Account[]> {
    return this.accounts$;
  }

  // U - Update
  public updateAccount(id:number, account: Account): void {
    this.http.put<Account>(`${this.url}/${id}`, account)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.ui.onUpdateAccount(account);
        this.accountSubject.next(account)
        // this.getAllAccounts();

        this.ui.openSnackBar('Account updated successfully');
      },
      error: err => {
        console.log(err);
      }
    });
  }


  // D - Delete

}
