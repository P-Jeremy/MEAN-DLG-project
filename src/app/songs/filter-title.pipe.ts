import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTitle'
})
export class FilterTitlePipe implements PipeTransform {

  transform(songs: any, term: any, isTitle: boolean): any {
    if (term === undefined) { return songs; }
    if (isTitle) {
      return songs.filter((song) => {
        return song.title.toLowerCase().includes(term.toLowerCase());
      });
    } else {
      return songs.filter((song) => {
        return song.author.toLowerCase().includes(term.toLowerCase());
      });
    }
  }
}
