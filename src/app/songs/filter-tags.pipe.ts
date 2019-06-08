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
    const filterSongs = [];

    songs.filter(song => song.tags.length);

    songs.filter(song => (song.tags as TagsData[]).map(tag => {
      if (tag.name === selectedTag) {
        filterSongs.push(song);
      }
    }));
    return filterSongs;
  }
}
