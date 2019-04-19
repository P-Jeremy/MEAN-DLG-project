import { NgModule } from '@angular/core';
import { SongCreateComponent } from './song-create/song-create.component';
import { SongListComponent } from './song-list/song-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilterTitlePipe } from './filter-title.pipe';
import { StaticModule } from '../static/static.module';


@NgModule({
  declarations: [
    FilterTitlePipe,
    SongListComponent,
    SongCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    StaticModule,
  ]
})

export class SongModule {}
