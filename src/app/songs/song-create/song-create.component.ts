import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../../posts/post-create/mime-type.validator';
import { Song } from '../../models/song.model';
import { SongsService } from '../songs.service';
import { Subject } from 'rxjs';

import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.css']
})
export class SongCreateComponent implements OnInit, OnDestroy {


  private mode = 'create';
  private songId: string;
  song: Song;
  lyrics = false;
  tab = false;
  isLoading = false;
  form: FormGroup;

  destroy$: Subject<boolean> = new Subject<boolean>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor( public songService: SongsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      author: new FormControl(null, {validators: [Validators.required]}),
      lyrics: new FormControl(null, {validators: [Validators.required]}),
      tab: new FormControl(null, {validators: [Validators.required], asyncValidators : [mimeType]})

    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('songId')) {
        this.mode = 'edit';
        this.songId = paramMap.get('songId');
        this.isLoading = true;
        this.songService.getSingleSong(this.songId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(SongData => {
              this.isLoading = false;
              this.song = {
                id: SongData._id,
                title: SongData.title,
                author: SongData.author,
                lyrics: SongData.lyrics,
                tab: SongData.tab
              };
              this.form.setValue({
                title: this.song.title,
                author: this.song.author,
                lyrics: this.song.lyrics,
                tab: this.song.tab
              });
            });
      } else {
        this.mode = 'create';
        this.songId = null;
      }
    });
  }

  onSaveSong() {
    if (this.form.invalid) {
      return;
    }
    const song: Song = {
      id: null,
      title: this.form.value.title,
      author: this.form.value.author,
    };
    this.isLoading = true;
    if (this.mode === 'create') {
      this.songService.addSongs(song.title, song.author, this.form.value.lyrics, this.form.value.tab);
    } else {
      this.songService.updateSong(this.songId, song.title, song.author, this.form.value.lyrics, this.form.value.tab);
    }
    this.lyrics = false;
    this.tab = false;
    this.form.reset();
  }

  onLyricsPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.lyrics = true;
    this.form.patchValue({
      lyrics: file
    });
    this.form.get('lyrics').updateValueAndValidity();
  }

  onTabPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.tab = true;
    this.form.patchValue({
      tab: file
    });
    this.form.get('tab').updateValueAndValidity();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
