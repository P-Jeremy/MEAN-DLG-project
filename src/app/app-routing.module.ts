import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';


import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { SongCreateComponent } from './songs/song-create/song-create.component';
import { SongListComponent } from './songs/song-list/song-list.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'post', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'create_post', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit_post/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'song', component: SongListComponent, canActivate: [AuthGuard] },
  { path: 'create_song', component: SongCreateComponent, canActivate: [AdminGuard] },
  { path: 'edit_song/:songId', component: SongCreateComponent, canActivate: [AdminGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})

export class AppRoutingModule { }
