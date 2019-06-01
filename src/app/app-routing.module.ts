import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SongListComponent } from './songs/song-list/song-list.component';


const routes: Routes = [
  { path: '', component: SongListComponent},
  { path: 'song', loadChildren: './songs/song.module#SongModule' },
  { path: 'post', loadChildren: './posts/post.module#PostModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})

export class AppRoutingModule { }
