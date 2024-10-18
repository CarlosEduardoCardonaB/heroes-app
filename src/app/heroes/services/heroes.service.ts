import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
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

  updateHero( hero: Hero ): Observable<Hero>{
    if(!hero.id) throw Error('Hero id is required');
      return this.httpClient.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  addHero( hero: Hero ): Observable<Hero>{
     return this.httpClient.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  delteHeroById( id: string ): Observable<boolean>{
    return this.httpClient.delete<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        //Pero si por el contrario si recibo respuesta entonces seteo la respuesta en true para confirmar que si hubo eliminación
        map( resp => true),
        //Si la respuesta retorna un error con este lo homologo y lo convierto en false para dar a entender que no se eliminó nada
        catchError( err => of(false))
      );
  }

}
