import { NgModule } from '@angular/core';
import {MatInputModule,
  MatCardModule,
  MatButtonModule, MatToolbarModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ]
})

export class AngularMaterialModule {}
