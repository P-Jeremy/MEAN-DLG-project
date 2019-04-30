
import { Component, Input, Output, EventEmitter } from '@angular/core';


import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent {

  @Input() songs: Song[];
  @Input() randomSong: Song;
  @Input() userIsAdmin: boolean;
  @Input() isShuffle: boolean;
  @Input() term: string;
  @Input() isTitle: boolean;
  @Output() emitSongIdToParent: EventEmitter<string> = new EventEmitter();


  constructor() { }

  /* Callback to emit song Id to parent */
  onDeleteClick(songId: string) {
    this.emitSongIdToParent.next(songId);
  }
}
