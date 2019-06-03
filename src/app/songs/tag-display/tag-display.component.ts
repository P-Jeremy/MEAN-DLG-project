import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongsService } from 'src/app/services/songs.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tag-display',
  templateUrl: './tag-display.component.html',
  styleUrls: ['./tag-display.component.css']
})
export class TagDisplayComponent implements OnInit, OnDestroy {

  tags = [];
  isLoading: boolean;


  private tagSub: Subscription;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private songService: SongsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.songService.getTags();

    this.tagSub = this.songService.getTagUpdatedListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tagData: { tags: [] }) => {
        this.isLoading = true;
        this.tags = tagData.tags;
        this.isLoading = false;
      });
  }

  /**
   * Callback that handles the tag deleting from DB
   *
   * @param id of the tag to delete
   *
   * @param name of the tag to delete
   */
  onDeleteTag(id: string, name: string) {
    if (confirm(`Supprimer la liste "${name}"?`)) {
      this.songService.deleteTag(id);
    }
  }

  ngOnDestroy() {
    this.tagSub.unsubscribe();
    this.destroy$.next(true);
  }
}
