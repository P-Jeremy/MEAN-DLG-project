import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { SongsService } from '../../services/songs.service';
import { AuthService } from '../../services/auth.service';
import { Song } from '../../models/song.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchBarService } from 'src/app/services/search-bar.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit, OnDestroy {

  songs: Song[] = [];
  randomSong;
  isLoading: boolean;
  userIsAdmin = false;
  isShuffle = false;
  isTitle: boolean;
  term: string;

  private songSub: Subscription;
  private classElement;
  private adminListenerSub: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    public songsService: SongsService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private searchBarService: SearchBarService
  ) { }

  ngOnInit() {



    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('shuffle')) {
        this.isLoading = true;

        this.songsService.getRandomSong();
        this.isShuffle = true;
      } else {
        this.isLoading = true;

        this.songsService.getSongs();

      }
    });

    this.songSub = this.songsService.getSongUpdatedListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((songData: { songs: Song[], songCount: number }) => {
        this.isLoading = true;

        this.songs = songData.songs;
        this.isLoading = false;

      });

    this.userIsAdmin = this.authService.getIsAdmin();


    this.adminListenerSub = this.authService.getAdminStatusListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isUserAdmin => {
        this.userIsAdmin = isUserAdmin;
      });

    this.searchBarService.currentTerm.pipe(takeUntil(this.destroy$))
      .subscribe(currentTerm => this.term = currentTerm);
    this.searchBarService.currentIsTitleState.pipe(takeUntil(this.destroy$))
      .subscribe(currentTitleState => this.isTitle = currentTitleState);
  }

  /** Callback to handle song delete from the DB
   * @param songId id of the song to delete
   * @param songTitle title of the song to delete
   */
  onDelete(songId: string, songTitle: string) {
    if (confirm(`Voulez vous vraiment supprimer "${songTitle}" ?`)) {
      this.isLoading = true;
      this.songsService.deleteSong(songId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.songsService.getSongs();
        }, error => {
          this.isLoading = false;
        });
    }
  }

  /** Callback to get a random song */
  onShuffle() {
    this.isLoading = true;
    this.songsService.getRandomSong();
    setTimeout(() => {
      // this.isLoading = false;
    }, 1000);
  }

  /**
   * Callback to invoke when selecting a song
   *
   * @param title of the selected song
   */
  onSelect(title: string) {
    this.classElement = document.getElementsByClassName(`${title}`);
    if (this.classElement.length > 0) {
      const element = this.classElement[0];
      setTimeout(() => {
        window.scrollTo({ top: this.centerElement(element), behavior: 'smooth' });
      }, 300);
    }
  }
  private centerElement(el: HTMLElement): number {
    const offsetTop = window.innerHeight / 3;
    return el.offsetTop - offsetTop;
  }



  ngOnDestroy() {
    this.songSub.unsubscribe();
    this.adminListenerSub.unsubscribe();
    this.destroy$.next(true);
  }
}
