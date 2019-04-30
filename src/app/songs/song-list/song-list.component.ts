import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { SongsService } from '../songs.service';
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
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(public songsService: SongsService, private authService: AuthService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.isShuffle = false;
    this.isLoading = true;
    setTimeout(() => {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('shuffle')) {
          this.isShuffle = true;
          this.songsService.getRandomSong()
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.randomSong = res.song;
          });
        }
      });
      this.songsService.getSongs();
      this.songSub = this.songsService.getSongUpdatedListener()
        .pipe(takeUntil(this.destroy$))
        .subscribe((songData: { songs: Song[], songCount: number }) => {
          this.songs = songData.songs;
          this.isLoading = false;
        });
      this.userIsAdmin = this.authService.getIsAdmin();
      this.adminListenerSub = this.authService
        .getAdminStatusListener()
        .pipe(takeUntil(this.destroy$))
        .subscribe(isUserAdmin => {
          this.userIsAdmin = isUserAdmin;
        });
    }, 500);
  }

  /* Callback to handle post delete on the DB */
  onDelete(songId: string) {
    this.isLoading = true;
    this.songsService.deleteSong(songId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.songsService.getSongs();
      }, error => {
        this.isLoading = false;
      });
  }

  onShuffle() {
    this.isLoading = true;
    this.songsService.getRandomSong()
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      this.randomSong = res.song;
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
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
    this.destroy$.next(true);
  }
}
