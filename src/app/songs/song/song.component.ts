
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';


import { Song } from '../../models/song.model';
import { SearchBarService } from '../search-bar/search-bar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit, OnDestroy {

  @Input() songs: Song[];
  @Input() randomSong: Song;
  @Input() userIsAdmin: boolean;
  @Input() isShuffle: boolean;
  @Output() emitSongIdToParent: EventEmitter<string> = new EventEmitter();

  isTitle: boolean;
  term: string;
  tab = false;
  lyrics = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private searchBarService: SearchBarService) { }

  ngOnInit() {
    this.searchBarService.currentTerm.pipe(takeUntil(this.destroy$)).subscribe(t => this.term = t);
    this.searchBarService.currentIsTitleState.pipe(takeUntil(this.destroy$)).subscribe(t => this.isTitle = t);
  }

  /* Callback to emit song Id to parent */
  onDeleteClick(songId: string) {
    this.emitSongIdToParent.next(songId);
  }

  onViewChange(ev: string) {
    switch (ev) {
      case 'lyrics':
        this.lyrics = !this.lyrics;
        this.tab = false;
        break;
      case 'tab':
        this.tab = !this.tab;
        this.lyrics = false;
        break;
      case 'both':
        this.tab = false;
        this.lyrics = false;
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
