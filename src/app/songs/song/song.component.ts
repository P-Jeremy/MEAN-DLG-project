
import { Component, Input, Output, EventEmitter } from '@angular/core';


import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent {

  @Input() userIsAdmin: boolean;

  @Input() isShuffle: boolean;

  @Output() emitSongIdToParent: EventEmitter<string> = new EventEmitter();

  @Output() triggerScroll: EventEmitter<any> = new EventEmitter();

  private _song: Song;

  /** OrderContent to be displayed */
  @Input() get song(): Song {
    return this._song;
  }

  set song(song: Song) {
    this._song = song;
  }

  tab = false;
  lyrics = false;

  constructor() { }

  /* Callback to emit song Id to parent */
  onDeleteClick(songId: string) {
    this.emitSongIdToParent.next(songId);
  }

  onSongOptions(ev: string, status: boolean) {
    switch (ev) {
      case 'lyrics':
        this.lyrics = status;
        break;
      case 'tab':
        this.tab = status;
        break;
      case 'close':
        this.tab = status;
        this.lyrics = status;
        break;
      default:
        break;
    }
  }

  onSelect() {
    this.triggerScroll.emit(null);
  }
}
