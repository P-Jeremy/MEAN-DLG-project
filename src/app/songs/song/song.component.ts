
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

  @Output() emitSongDeleteToParent: EventEmitter<string> = new EventEmitter();

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

  /* Callback to trigger the delete action in parent */
  onDeleteClick() {
    this.emitSongDeleteToParent.emit();
  }

  /**
   * CallBack to trigger tab and lyrics state
   * @param ev Use case
   * @param status boolean
   */
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

  /* Callback to trigger scroll action in parent */
  onSelect() {
    this.triggerScroll.emit(null);
  }
}
