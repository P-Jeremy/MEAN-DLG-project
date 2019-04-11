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
@Injectable({providedIn: 'root'})
export class SongsService {
  private songs: Song[] = [];
  private songUpdated = new Subject<{songs: Song[], songCount: number}>();
  private songStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {}

  /**
   *  Get Song method
   *
   * @param songsPerPage allows to handle pagination through a query
   *
   * @param currentPage allows to handle pagination through a query
   *
   * @returns all the songs of DB through the songUpdated observable
   */
  getSongs(songsPerPage: number, currentPage: number) {
    const queryPaginationParams = `?pageSize=${songsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, songs: any, maxSongs: number}>(API_DOMAIN + queryPaginationParams)
        .pipe(map((songData) => {
          return {
            songs: songData.songs.map(song => {
              return {
                title: song.title,
                author: song.author,
                id: song._id,
                lyrics: song.lyrics,
                tab: song.tab
              };
            }),
            maxSongs: songData.maxSongs};
        }))
        .subscribe((transformedSongData) => {
          this.songs = transformedSongData.songs;
          this.songUpdated.next({
            songs: [...this.songs],
            songCount: transformedSongData.maxSongs
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
   * @returns the post corresponding to the id
   */
  getSingleSong(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      author: string,
      lyrics: string,
      tab: string}>(API_DOMAIN + id);
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
  addSongs(title: string, author: string, lyrics: File, tab: File) {

    const songData = new FormData();
    songData.append('title', title);
    songData.append('author', author);
    songData.append('lyrics', lyrics, title);
    songData.append('tab', tab, title);

    this.http.post<{message: string, song: Song}>(API_DOMAIN, songData)
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
  updateSong(id: string, title: string, author: string, lyrics: File | string, tab: File | string) {
    let songData: Song | FormData;
    /* If updated post has a new image as a file */
    if (typeof(lyrics) === 'object') {
      songData = new FormData();
      songData.append('id', id);
      songData.append('title', title);
      songData.append('content', author);
      songData.append('lyrics', lyrics, title);
    /* Else, image === url as a string */
    } else if (typeof(tab) === 'object') {
        songData = new FormData();
        songData.append('id', id);
        songData.append('title', title);
        songData.append('content', author);
        songData.append('tab', tab, title);
      /* Else, image === url as a string */
    } else {
        songData = {
          id,
          title,
          author,
          lyrics,
          tab
        };
    }
    this.http.put(API_DOMAIN + id, songData)
        .subscribe(() => {
          this.redirect();
        });
  }

  /** Return to home page */
  redirect() {
    this.router.navigate(['/song']);
  }

  /**
   *  Delete Song method
   *
   * @param songId Id of the song to delete
   */
  deleteSong(songId: string) {
    return this.http.delete(API_DOMAIN + songId);
  }
}
