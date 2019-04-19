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
  randomSong;
  isLoading = false;
  userIsAdmin = false;
  isTitle = true;
  isAuthor = false;
  isShuffle = false;

  private songSub: Subscription;
  private adminListenerSub: Subscription;

  constructor(public songsService: SongsService, private authService: AuthService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.isShuffle = false;
    this.isLoading = true;
    setTimeout(() => {
      this.songsService.getSongs();
      this.songSub = this.songsService.getSongUpdatedListener()
        .subscribe((songData: { songs: Song[], songCount: number }) => {
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
    }, 500);

  }

  /* Callback to handle post delete on the DB */
  onDelete(postId: string) {
    this.isLoading = true;
    this.songsService.deleteSong(postId)
      .subscribe(() => {
        this.songsService.getSongs();
      }, error => {
        this.isLoading = false;
      });
  }

  onShuffle() {
    if (this.songs.length > 0) {
      this.isLoading = true;
      this.songsService.getRandomSong().subscribe((res) => {
      this.randomSong = res.song;
      });
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
