import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';

const url = 'http://localhost:3000/api/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  public isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post(`${url}/signup`, authData).subscribe(
      (result) => {
        console.log(result);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post(`${url}/login`, authData).subscribe(
      (result: any) => {
        console.log(result);
        this.token = result.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}
