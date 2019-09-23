import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/song.model';

@Pipe({
  name: 'filterTitle'
})

export class FilterTitlePipe implements PipeTransform {

  /**
   * Allows to arrange the songs array by title or author
   * @param songs
   * @param term
   * @param orderByTitle
   *
   * @returns the songs array arranged
   */
  transform(songs: Song[], term: string, orderByTitle: boolean): Song[] {
    if (!orderByTitle) {
      if (term === undefined) {
        return songs.sort((a, b) => {
          return a.author === b.author ? 0 : a.author < b.author ? -1 : 1;
        });
      } else {
        return songs.filter((song) => {
          return song.author.toLowerCase().includes(term.toLowerCase());
        }).sort((a, b) => {
          return a.author === b.author ? 0 : a.author < b.author ? -1 : 1;
        });
      }
    } else {
      if (term === undefined) {
        return songs.sort((a, b) => {
          return a.title === b.title ? 0 : a.title < b.title ? -1 : 1;
        });
      } else {
        return songs.filter((song) => {
          return song.title.toLowerCase().includes(term.toLowerCase());
        }).sort((a, b) => {
          return a.title === b.title ? 0 : a.title < b.title ? -1 : 1;
        });
      }
    }
  }
}
