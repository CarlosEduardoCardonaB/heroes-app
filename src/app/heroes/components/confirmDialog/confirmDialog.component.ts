import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirmDialog.component.html',
  styles: []

})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Hero,
  ){
    console.log('impresion data desde confirmDialog.component.ts');
    console.log({data});
  }

  onNoClick(): void{
    this.dialogRef.close(false)
  }

  onConfirm(): void{
    this.dialogRef.close(true)
  }

 }
