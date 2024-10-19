import { Component } from '@angular/core';
import { AuthService } from '../../../auth/servicios/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  get user(): User | undefined {
    return this.authService.currentUser;
  }

  public sideBarItems = [
        {
          label: 'Listado', icon: 'label', url: './list'
        },
        {
          label: 'Añadir', icon: 'add', url: './new-hero'
        },
        {
          label: 'Buscar', icon: 'search', url: './search'
        }
    ]

    onLogout():void{
      this.authService.logout();
      this.router.navigate(['/auth/login'])
    }

}
