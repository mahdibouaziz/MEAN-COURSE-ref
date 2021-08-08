import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.model';

const url = 'http://localhost:3000/api/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  constructor(private http: HttpClient) {}

  getToken(): string {
    return this.token;
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
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
