import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTitle'
})
export class FilterTitlePipe implements PipeTransform {

  transform(songs: any, term: any, isTitle: boolean): any {
    if (!isTitle) {
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
