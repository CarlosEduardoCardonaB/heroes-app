import { Component } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {

  constructor( private heroService: HeroesService ){}

  public creatorList = [
    {id:'DC Comics', desc: 'DC -  Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ]

  addHero( hero: Hero ){
    this.heroService.addHero(hero);
  }
}
