import { Component } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {

  constructor( private heroService: HeroesService ){}

  public heroForm = new FormGroup({
      id:               new FormControl<String>(''),
      superhero:        new FormControl<String>('', { nonNullable: true }),
      publisher:        new FormControl<Publisher>(Publisher.DCComics),
      alter_ego:        new FormControl(''),
      first_appearance: new FormControl(''),
      characters:       new FormControl(''),
      alt_img:          new FormControl('')
  })

  public creatorList = [
    {id:'DC Comics', desc: 'DC -  Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ];

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmitForm():void{
    console.log({
      fomIsValid: this.heroForm.valid,
      vale: this.heroForm.value,
    });

    if(this.heroForm.invalid ) return;

    //this.heroService.addHero( this.heroForm.value )

  }

  addHero( hero: Hero ){
    this.heroService.addHero(hero);
  }
}
