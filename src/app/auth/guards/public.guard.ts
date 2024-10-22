import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PublicGuard implements CanMatch {
  constructor(
    private authServie: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus():Observable<boolean>{
    return this.authServie.checkAutentication()
      .pipe(
        tap( isAuthenticated => console.log('is autenticated: ', isAuthenticated)),
        tap( isAuthenticated => {
          if( isAuthenticated ){
            this.router.navigate(['./']);
          }
        }),
        //El siguiente map se usa para permitirle a la persona entrar a la ruta de login sin tener sesion abierta. Entonces le asignamos la negación al isAuthenticated que basicamente es devolver un false
        map( isAuthenticated => !isAuthenticated )
      )

  }


  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean>{
    // console.log('canActivate');
    // console.log({ route, state });
    return this.checkAuthStatus();
  }

}
