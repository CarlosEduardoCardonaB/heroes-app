import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})

export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getHeroes():Observable<Hero[]>{
      return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById( id: string ): Observable<Hero | undefined>{
    return this.httpClient.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        //En caso de existir un error debo definir el of (de la librerpia rxjs) para retornar un "undefined" pero cumpliendo la condición de que sea un observable tal como lo definimos
        //en el tipo de dato que retornará esta función
        catchError( error => of( undefined ) )
      )
  }

  getSuggestion( query: string ): Observable<Hero[]>{
      return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }

}
