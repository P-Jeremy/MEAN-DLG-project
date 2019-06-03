import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { SongsService } from '../../services/songs.service';
import { AuthService } from '../../services/auth.service';
import { Song, TagsData } from '../../models/song.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchBarService } from 'src/app/services/search-bar.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, OnDestroy {

  songs: Song[] = [];
  songsCopy: Song[] = [];
  randomSong = [];
  isLoading: boolean;
  userIsAdmin = false;
  isShuffle = false;
  isTitle: boolean;
  term: string;
  tags: TagsData[];
  selectedTag: string;

  private songSub: Subscription;
  private tagSub: Subscription;
  private classElement;
  private adminListenerSub: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    public songService: SongsService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private searchBarService: SearchBarService
  ) { }

  ngOnInit() {

    this.isLoading = true;

    this.songService.getSongs();

    this.songSub = this.songService.getSongUpdatedListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((songData: { songs: Song[], songCount: number }) => {
        this.isLoading = true;

        this.songs = songData.songs;
        this.songsCopy = [...this.songs];
        this.isLoading = false;
      });

    this.songService.getTags();
    this.tagSub = this.songService.getTagUpdatedListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tagData) => {
        this.tags = tagData.tags;
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
      this.songService.deleteSong(songId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.songService.getSongs();
        }, error => {
          this.isLoading = false;
        });
    }
  }

  /** Callback to get a random song */
  onShuffle() {
    this.isLoading = true;
    this.isShuffle = true;
    this.songs.splice(0, this.songs.length);
    setTimeout(() => {
      this.songs.push(this.songsCopy[Math.floor(Math.random() * this.songsCopy.length)]);
      this.isLoading = false;
    }, 1000);
  }

  /** Allows to go back to the main song list */
  onCancelShuffle() {
    this.isLoading = true;
    this.isShuffle = false;
    this.songs.splice(0, this.songs.length);
    setTimeout(() => {
      this.songs = [...this.songsCopy];
      this.isLoading = false;
    }, 1000);
  }

  /**
   * Allows to select a tag from the list
   *
   * @param ev name of the tag
   */
  changeTag(ev: string) {
    this.selectedTag = ev;
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
        const elementInfos = element.getBoundingClientRect();
        window.scrollTo({ top: this.centerElement(element, elementInfos), behavior: 'smooth' });
      }, 250);
    }
  }
  private centerElement(el: HTMLElement, elInfo: ClientRect): number {
    const offsetTop = (window.innerHeight - elInfo.top) / 2.5;

    return el.offsetTop - offsetTop;
  }



  ngOnDestroy() {
    this.songSub.unsubscribe();
    this.tagSub.unsubscribe();
    this.adminListenerSub.unsubscribe();
    this.destroy$.next(true);
  }
}
