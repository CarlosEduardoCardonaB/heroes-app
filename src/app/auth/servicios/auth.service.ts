import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User

  constructor(private http: HttpClient) {}

  get currentUser(): User | undefined {
    if(!this.user) return undefined;
    //El structuredClone nos sirve para realizar un clon profundo, en este caso retorna un clon del this.user
    return structuredClone(this.user);
  }

    login( email: String, password: String ):Observable<User>{

      return this.http.get<User>(`${this.baseUrl}/users/1`)
        .pipe(
          tap( user => this.user = user ),
          tap( user => localStorage.setItem('token', user.id.toString())),
        );

      }

      logout():void{
        this.user = undefined;
        localStorage.clear();
      }


  }


