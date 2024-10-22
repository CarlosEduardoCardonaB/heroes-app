import { Injectable } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { ActivatedRouteSnapshot, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanMatch {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus():Observable<boolean>{
    return this.authService.checkAutentication()
      .pipe(
        tap( isAuthenticated => console.log('isAuthenticated: ', isAuthenticated)), //Solo lo uso para ver por consola si el usuario está autenticado, es true o false
        tap( isAuthenticated => {
          if(!isAuthenticated){ //Validamos autenticación, y si no está autenticado redireccionamos al login
            this.router.navigate(['./auth/login']);
          }
        } )
      )

  }

  //Este método se implementa en las rutas principales como guardian, en este caso se implementó en app-routing.module.ts
  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    // console.log('canMatch');
    // console.log({ route, segments });
    return this.checkAuthStatus();
  }

  //Este método se implementa en las rutas principales como guardian, en este caso se implementó en app-routing.module.ts
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean>{
    // console.log('canActivate');
    // console.log({ route, state });
    return this.checkAuthStatus();
  }

}
