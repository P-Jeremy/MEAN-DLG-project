import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SongListComponent } from './song-list/song-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { SongCreateComponent } from './song-create/song-create.component';



const routes: Routes = [
  { path: 'song/:shuffle', component: SongListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: SongCreateComponent, canActivate: [AdminGuard] },
  { path: 'song/edit/:songId', component: SongCreateComponent, canActivate: [AdminGuard] },
];
@NgModule({
  imports: [
  RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard, AdminGuard]
})

export class SongRoutingModule {}
