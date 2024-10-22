import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [PublicGuard],
    canMatch: [PublicGuard]
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then(m => m.HeroesModule),
    canActivate: [AuthGuard],
    canMatch: [AuthGuard]
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '',
    redirectTo: 'heroes',
    //con el pathMatch: 'full' indicamos que solo las rutas que no tengan ninguna palabra después del slash del dominio. ej dominio.com/ si no colocamos esto cualquier dominio asi por ej dominio.com/pagina caería aqui por lo que detecta cualquier vacio en el path
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
    //Aqui indicamos que cualquier otra ruta no configurada anteriormente lo rediriga al 404 por que no existe
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
