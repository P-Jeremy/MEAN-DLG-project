import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';

import { SongsService } from '../songs.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit, OnDestroy {

  songs: Song[] = [];
  isLoading = false;
  totalSongs = 0;
  songsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 3, 5, 10];
  userIsAdmin = false;

  private songSub: Subscription;
  private adminListenerSub: Subscription;

  constructor(public songsService: SongsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.songsService.getSongs(this.songsPerPage, this.currentPage);
    this.songSub = this.songsService.getSongUpdatedListener()
        .subscribe((songData: { songs: Song[], songCount: number}) => {
          this.totalSongs = songData.songCount;
          this.songs = songData.songs;
          this.isLoading = false;
        });
    this.userIsAdmin = this.authService.getIsAdmin();
    this.adminListenerSub =  this.authService
      .getAdminStatusListener()
      .subscribe(isUserAdmin => {
      this.userIsAdmin = isUserAdmin;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.songsPerPage = pageData.pageSize;
    this.songsService.getSongs(this.songsPerPage, this.currentPage);
  }

  /* Callback to handle post delete on the DB */
  onDelete(postId: string) {
    this.isLoading = true;
    this.songsService.deleteSong(postId)
    .subscribe(() => {
      this.songsService.getSongs(this.songsPerPage, this.currentPage);
    }, error => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.songSub.unsubscribe();
    this.adminListenerSub.unsubscribe();
  }
}
