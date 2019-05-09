
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef } from '@angular/core';


import { Song } from '../../models/song.model';
import { SearchBarService } from '../../services/search-bar.service';
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
  panelState = false;
  class: string;

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

  /**
   * Callback to invoke when selecting a song
   *
   * @param title of the selected song
   */
  onSelect(title: string) {
    this.tab = false;
    this.lyrics = false;
    this.class = title;
    const classElement = document.getElementsByClassName(`${this.class}`);
    if (classElement.length > 0) {
      setTimeout(() => {
        classElement[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }, 200);
    }
  }

  onViewChange(ev: string, expanded?: boolean) {
    switch (ev) {
      case 'lyrics':
        this.lyrics = !this.lyrics;
        break;
      case 'tab':
        this.tab = !this.tab;
        break;
      case 'close':
        this.tab = expanded;
        this.lyrics = expanded;
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
