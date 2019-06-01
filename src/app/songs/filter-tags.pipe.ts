import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/song.model';

@Pipe({
  name: 'filterTags'
})
export class FilterTagsPipe implements PipeTransform {

  transform(songs: Song[], tag: string): any {
    if (tag === undefined) {
      return songs;
    }
    const filterSongs = songs.filter(song => {
      if (song.tags.length > 0) {
        return song.tags.filter(s => s.name.includes(tag));
      }
      return;
    });
    return filterSongs;
  }
}
