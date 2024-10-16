import { Component, OnInit } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  constructor(
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar //Este snackbar sirve para mostrar mensajes de exito cuando creamos o actualizamos un dato, y es de angular material
  ){}

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

  ngOnInit(): void {
    if( !this.router.url.includes('edit' )) return;

    //Aqui capturamos los parámetros que llegan por la url
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroService.getHeroById( id )), //Aqui comprobamos si existe un héroe con este ID, si no existe llevamos al usuairo al home, de lo contrario sigue
      ).subscribe( hero => {
        if( !hero ) return this.router.navigateByUrl('/');

        //el .reset nos sirve para regresar el formulario al estado inicial, o si le enviamos un argumento el nos precarga los campos que coincidan con los nombres en el formulario.
        //En este caso como enviamos un objeto hero que es igual a los campos del formulario, entonces nos precarga esta info en el formulario
        this.heroForm.reset( hero );
        return;

       })

  }

  //Este get currentHero se realiza para enlazar los datos del formulario que en este caso es el this.herForm.value con el tipo de dato Hero
  //Esto se hace para que el tipo de dato Hero que espera el servicio heroes.service.ts coincida con el que le enviamos, que en este caso es el return hero de este get
  //Después de realizar este seteo enviamos al servicio un this.currenHero en vez de enviar el this.herForm.value
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

    //En estas validaciones podemos invocar el this.currentHero.id o el this.heroForm.value.id por que son lo mismo, pero para consumir el heroService si enviamos el this.currentHero
    if(this.currentHero.id){
      this.heroService.updateHero(this.currentHero)
        .subscribe( hero => {
          //Todo mostrar snackbar, ej registro actualizado
          this.showSnackBar(`${hero.superhero} updated!`)
        });
        return;
    }

    this.heroService.addHero( this.currentHero )
      .subscribe( hero => {
        //TODO: mostrar snackbar y navegar a /heroes/edit/ hero.id
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(`${hero.superhero} created!`);

      })

  }

  //Este snackbar sirve para mostrar mensajes de exito cuando creamos o actualizamos un dato, y es de angular material
  showSnackBar( message: string ):void{
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }


}
