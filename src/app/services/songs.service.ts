import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


/* SONG interface */
import { Song } from '../models/song.model';

import { environment } from '../../environments/environment';

const API_DOMAIN = environment.apiDomain + '/songs/';

/*
* Makes the service available at all 'root' levels of the application.
* Wich means everywhere on the SPA
*/
@Injectable({ providedIn: 'root' })
export class SongsService {
  private songs: Song[] = [];
  private songUpdated = new Subject<{ songs: Song[] }>();
  private songStatusListener = new Subject<boolean>();

  private tags: [] = [];
  private tagUpdated = new Subject<{ tags: any }>();
  private tagStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) { }

  /**
   *  Get Songs method
   *
   * @returns all the songs of DB through the songUpdated observable
   */
  getSongs() {
    this.http.get<{ message: string, songs: any }>(API_DOMAIN)
      .pipe(map((songData) => {
        return {
          songs: songData.songs.map(song => {
            return {
              title: song.title,
              author: song.author,
              id: song._id,
              lyrics: song.lyrics,
              tab: song.tab,
              tags: song.tags
            };
          }),
        };
      }))
      .subscribe((transformedSongData) => {
        this.songs = transformedSongData.songs;
        this.songUpdated.next({
          songs: [...this.songs]
        });
      });
  }

  /**
   * @returns the songUpdated as an observable
   */
  getSongUpdatedListener() {
    return this.songUpdated.asObservable();
  }

  /**
   * @param takes the id of the song to edit
   *
   * @returns the song corresponding to the id
   */
  getSingleSong(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      author: string,
      lyrics: string,
      tab: string,
      tags: any
    }>(`${API_DOMAIN}/single` + id);
  }

  /**
   *  Add Song method
   *
   * @param title of the song to add
   *
   * @param author of the song to add
   *
   * @param lyrics of the song in pdf
   *
   * @param tab of the song in pdf
   *
   * @returns the response through the postUpdated observable
   */
  addSongs(title: string, author: string, lyrics: string, tab: File, tags: []) {

    const songData = new FormData();
    songData.append('title', title);
    songData.append('author', author);
    songData.append('lyrics', lyrics);
    songData.append('tab', tab, title);
    songData.append('tags', JSON.stringify(tags));

    this.http.post<{ message: string, song: Song }>(API_DOMAIN, songData)
      .subscribe(() => {
        this.songStatusListener.next(true);
        this.redirect();
      },
        error => {
          this.songStatusListener.next(false);
          this.redirect();
        });
  }

  /**
   *  Update Song method
   *
   * @param songId Id of the song to delete
   *
   * @param title of the song
   *
   * @param author of the song
   *
   * @param lyrics of the song
   *
   * @param tab of the song
   *
   * @returns the response through the postUpdated observable
   */
  updateSong(id: string, title: string, author: string, lyrics: string, tab: File | string, tags: []) {
    let songData: Song | FormData;

    /* If updated song has a new tab image as a file */
    if (typeof (tab) === 'object') {
      songData = new FormData();
      songData.append('id', id);
      songData.append('title', title);
      songData.append('content', author);
      songData.append('tab', tab, title);
      songData.append('lyrics', lyrics);
      songData.append('tags', JSON.stringify(tags));

      /* Else, tab image === url as a string */
    } else {
      songData = {
        id,
        title,
        author,
        lyrics,
        tab,
        tags: JSON.stringify(tags)
      };
    }
    this.http.put(`${API_DOMAIN}/edit` + id, songData)
      .subscribe(() => {
        this.redirect();
      });
  }

  /** Return to home page */
  redirect(ev?: string) {
    const to = ev ? `/song${ev}` : `/`;
    this.router.navigate([to]);
  }

  /**
   *  Delete Song method
   *
   * @param songId Id of the song to delete
   */
  deleteSong(songId: string) {
    return this.http.delete(API_DOMAIN + songId);
  }

  addTag(title: string) {
    const newList = { title };
    return this.http.post<{ message: string, tag: string }>(`${API_DOMAIN}tags`, newList)
      .subscribe(() => {
        this.router.navigateByUrl('song', { skipLocationChange: true }).then(() =>
          this.router.navigate(["song/tag"]));
      });
  }

  /**
   *  Get Tags method
   *
   * @returns all the tags of DB through the tagUpdated observable
   */
  getTags() {
    this.http.get<{ message: string, tags: any }>(`${API_DOMAIN}tags`)
      .pipe(map((tagData) => {
        return {
          tags: tagData.tags.map(tag => {
            return tag;
          }),
        };
      }))
      .subscribe((transformedTagData) => {
        this.tags = transformedTagData.tags;
        this.tagUpdated.next({
          tags: [...this.tags]
        });
      });
  }

  /**
   *  Delete Tag method
   *
   * @param tagId Id of the song to delete
   */
  deleteTag(tagId: string) {
    return this.http.delete(`${API_DOMAIN}/delete/tags` + tagId)
      .subscribe(() => {
        this.router.navigateByUrl('song', { skipLocationChange: true }).then(() =>
          this.router.navigate(["song/tag"]));
      });
  }

  /**
   * @returns the tagUpdated as an observable
   */
  getTagUpdatedListener() {
    return this.tagUpdated.asObservable();
  }
}
