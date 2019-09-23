
import { Pipe, PipeTransform } from '@angular/core';
import { Song, TagsData } from '../models/song.model';
@Pipe({
  name: 'filterTags'
})
export class FilterTagsPipe implements PipeTransform {


  /**
   * Filters songs depending on the selected tag
   * @param songs
   * @param selectedTag
   */
  transform(songs: Song[], selectedTag: string): Song[] {
    if (selectedTag === undefined) {
      return songs;
    }
    const filterSongs: Song[] = [];

    songs.filter(song => song.tags.length).forEach(song => (song.tags as TagsData[]).forEach(tag => {
      if (tag.name === selectedTag) {
        filterSongs.push(song);
      }
    }));
    return filterSongs;
  }
}
