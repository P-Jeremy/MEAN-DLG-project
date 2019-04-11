import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTitle'
})
export class FilterTitlePipe implements PipeTransform {

  transform(songs: any, term: any): any {
    if (term === undefined) { return songs; }
    return songs.filter((song) => {
      return song.title.toLowerCase().includes(term.toLowerCase());
    });
  }
}
