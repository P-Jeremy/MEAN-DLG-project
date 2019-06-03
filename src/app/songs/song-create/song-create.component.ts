import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../../posts/post-create/mime-type.validator';
import { Song, TagsData } from '../../models/song.model';
import { SongsService } from '../../services/songs.service';
import { Subject, Subscription } from 'rxjs';


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
  help = false;
  tab = false;
  isLoading = false;
  form: FormGroup;
  tags: TagsData[];

  private tagSub: Subscription;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public songService: SongsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      author: new FormControl(null, { validators: [Validators.required] }),
      lyrics: new FormControl(null, { validators: [Validators.required] }),
      tab: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      selectedTags: new FormControl([]),
    });



    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('songId')) {
        this.mode = 'edit';
        this.songId = paramMap.get('songId');
        this.isLoading = true;
        this.songService.getTags();
        this.tagSub = this.songService.getTagUpdatedListener()
          .pipe(takeUntil(this.destroy$))
          .subscribe((tagData: { tags: [] }) => {
            this.tags = tagData.tags;
          });
        this.songService.getSingleSong(this.songId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(SongData => {
            this.isLoading = false;
            this.song = {
              id: SongData._id,
              title: SongData.title,
              author: SongData.author,
              lyrics: SongData.lyrics,
              tab: SongData.tab,
              tags: (SongData.tags as TagsData[])
            };
            let selectedTags = [];
            if (this.song.tags.length) {
              selectedTags = (this.song.tags as TagsData[]).map(tag => tag['_id']);
            }
            this.form.setValue({
              title: this.song.title,
              author: this.song.author,
              lyrics: this.song.lyrics,
              tab: this.song.tab,
              selectedTags
            });
          });
      } else {
        this.mode = 'create';
        this.songId = null;
        this.songService.getTags();
        this.tagSub = this.songService.getTagUpdatedListener()
          .pipe(takeUntil(this.destroy$))
          .subscribe((tagData) => {
            this.tags = tagData.tags;
          });
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
      this.songService.addSongs(song.title, song.author, this.form.value.lyrics, this.form.value.tab, this.form.value.selectedTags);
    } else {
      this.songService.updateSong(this.songId, song.title, song.author, this.form.value.lyrics, this.form.value.tab, this.form.value.selectedTags);
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
    this.tagSub.unsubscribe();
    this.destroy$.next(true);
  }
}
