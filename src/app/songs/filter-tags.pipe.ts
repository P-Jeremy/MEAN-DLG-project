import { Pipe, PipeTransform } from '@angular/core';
import { Song, TagsData } from '../models/song.model';

@Pipe({
  name: 'filterTags'
})
export class FilterTagsPipe implements PipeTransform {

  transform(songs: Song[], selectedTag: string): any {
    if (selectedTag === undefined) {
      return songs;
    }
    const filterSongs = songs.filter(song => {
      if (song.tags.length > 0) {
        return (song.tags as TagsData[]).filter(tag => tag.name.includes(selectedTag));
      }
      return;
    });
    return filterSongs;
  }
}
