import { NgModule } from '@angular/core';
import { SongCreateComponent } from './song-create/song-create.component';
import { SongListComponent } from './song-list/song-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SongCreateComponent,
    SongListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class SongModule {}
