import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatMenuModule,
  MatCheckboxModule,
  MatSlideToggleModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ]
})

export class AngularMaterialModule { }
