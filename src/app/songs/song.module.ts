import { NgModule } from '@angular/core';
import { SongCreateComponent } from './song-create/song-create.component';
import { SongListComponent } from './song-list/song-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StaticModule } from '../static/static.module';
import { SongComponent } from './song/song.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchBarService } from '../services/search-bar.service';
import { SongRoutingModule } from './song-routing.module';
import { FilterTitlePipe } from './filter-title.pipe';


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
    SongRoutingModule
  ],
  providers: [SearchBarService]
})

export class SongModule {}
