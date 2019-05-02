import { NgModule } from '@angular/core';
import { SongCreateComponent } from './song-create/song-create.component';
import { SongListComponent } from './song-list/song-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilterTitlePipe } from './filter-title.pipe';
import { StaticModule } from '../static/static.module';
import { SongComponent } from './song/song.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchBarService } from './search-bar/search-bar.service';


@NgModule({
  declarations: [
    FilterTitlePipe,
    SongListComponent,
    SongCreateComponent,
    SongComponent,
    SearchBarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    StaticModule,
  ],
  providers: [SearchBarService]
})

export class SongModule {}
