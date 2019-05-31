import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/song.model';

@Pipe({
  name: 'filterTags'
})
export class FilterTagsPipe implements PipeTransform {

  transform(songs: Song[], tag?: string): any {
    if (!tag) {
      return;
    }
    return songs.filter(song => song.tags[`${tag}`]);
  }
}
