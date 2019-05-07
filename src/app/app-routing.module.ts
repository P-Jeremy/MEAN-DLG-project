import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

import { SongCreateComponent } from './songs/song-create/song-create.component';
import { SongListComponent } from './songs/song-list/song-list.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'song', component: SongListComponent, canActivate: [AuthGuard] },
  { path: 'song/:shuffle', component: SongListComponent, canActivate: [AuthGuard] },
  { path: 'create_song', component: SongCreateComponent, canActivate: [AdminGuard] },
  { path: 'edit_song/:songId', component: SongCreateComponent, canActivate: [AdminGuard] },
  { path: 'post', loadChildren: './posts/post.module#PostModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})

export class AppRoutingModule { }
