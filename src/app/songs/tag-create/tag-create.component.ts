import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongsService } from 'src/app/services/songs.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.css']
})


export class TagCreateComponent implements OnInit, OnDestroy {

  isLoading = false;
  form: FormGroup;




  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public songService: SongsService, public route: ActivatedRoute) { }


  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  /**
   * Caallback tha handle the new tag creation
   *
   * @param title of the tag to create
   */
  onSaveTag(title: string) {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const tagTitle = this.form.value.title;
    this.songService.addTag(tagTitle);
    this.form.reset('');
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

}
