import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SongsService } from '../songs.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Song } from '../../models/song.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit, OnDestroy {

  songs: Song[] = [];
  isLoading = false;
  totalSongs = 0;
  songsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];
  userIsAdmin = false;
  isTitle = true;
  isAuthor = false;
  isShuffle = false;

  private songSub: Subscription;
  private adminListenerSub: Subscription;

  constructor(public songsService: SongsService, private authService: AuthService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading = true;
    this.songsService.getSongs(this.songsPerPage, this.currentPage);
    this.songSub = this.songsService.getSongUpdatedListener()
      .subscribe((songData: { songs: Song[], songCount: number }) => {
        this.totalSongs = songData.songCount;
        this.songs = songData.songs;
      });
    this.userIsAdmin = this.authService.getIsAdmin();
    this.adminListenerSub = this.authService
      .getAdminStatusListener()
      .subscribe(isUserAdmin => {
        this.userIsAdmin = isUserAdmin;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      if (paramMap.has('shuffle')) {
        this.isShuffle = true;
        setTimeout(() => {
          this.onShuffle();
          this.isLoading = false;
        }, 200);
      }
      this.isLoading = false;
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

  onShuffle() {
    if (this.songs.length > 0) {
      this.isLoading = true;
      this.songsService.getRandomSong()
      this.isLoading = false;
    } else {
      this.isLoading = false;
      return;
    }
  }

  /**
   * Handle switch between 2 filter modes
   * @param ev box check status
   * @param src of the box checked
   */
  onBoxChecked(ev: any, src: string) {
    switch (src) {
      case 'title':
        this.isTitle = ev.checked;
        break;
      default:
        this.isTitle = false;
    }
  }

  ngOnDestroy() {
    this.songSub.unsubscribe();
    this.adminListenerSub.unsubscribe();
  }
}
