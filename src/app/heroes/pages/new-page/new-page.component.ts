import { Component, OnInit } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirmDialog/confirmDialog.component';

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
    private snackbar: MatSnackBar, //Este snackbar sirve para mostrar mensajes de exito cuando creamos o actualizamos un dato, y es de angular material
    private dialog: MatDialog
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

  onDeleteHero():void{
    if( !this.currentHero.id ) throw Error('Hero id is required');
    //console.log('entre al delte hero');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    //Este código funciona pero lo vamos a optimizar para que no quede un subscribe adentro de otro subscribe
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log({result});
    //   if(!result) return;
    //   console.log('delted');
    //   this.heroService.delteHeroById( this.currentHero.id )
    //     .subscribe( deletedHero => {
    //       if( deletedHero )
    //         this.router.navigate(['/heroes']);
    //     });

    // });

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result === true), //El filter se usa para validar y dejar seguir si la condición se cumple, en este caso se valida si la respuesta es true
      // este filter de arriba también se puede expresar asi y es lo mismo -> filter( (result: boolean) => result) en donde valida que sea verdadera, hacer de cuenta estos valores asi !result o result
      switchMap( () => this.heroService.delteHeroById( this.currentHero.id )),
      tap( wasDeleted => console.log({wasDeleted})),
      //Después de eliminar el héroe esperamos un true del servicio de delteHeroById, y si llega en true, este filter lo deja pasar
      filter( (wasDeleted: boolean) => wasDeleted),
    )
    //Después de todas las validaciones anteriores se ejecutará este subscribe si y solo si se cumplen las validacioens anteriores
    .subscribe( (result) => {
      this.router.navigate(['/heroes']);
      console.log({result})
    })
  }

  //Este snackbar sirve para mostrar mensajes de exito cuando creamos o actualizamos un dato, y es de angular material
  showSnackBar( message: string ):void{
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }


}
