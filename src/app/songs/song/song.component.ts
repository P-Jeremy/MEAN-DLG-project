
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';


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
    this.searchBarService.currentTerm.pipe(takeUntil(this.destroy$))
      .subscribe(currentTerm => this.term = currentTerm);
    this.searchBarService.currentIsTitleState.pipe(takeUntil(this.destroy$))
      .subscribe(currentTitleState => this.isTitle = currentTitleState);
  }

  /* Callback to emit song Id to parent */
  onDeleteClick(songId: string) {
    this.emitSongIdToParent.next(songId);
  }

  onViewChange(ev: string, anchor?: string) {
    switch (ev) {
      case 'lyrics':
        this.lyrics = !this.lyrics;
        break;
      case 'tab':
        this.tab = !this.tab;
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
