import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];
  userIsAuth = false;
  userId: string;
  commentInput = false;
  form: FormGroup;

  private postSub: Subscription;
  private authListenerSub: Subscription;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      comment: new FormControl(null, { validators: [Validators.required, Validators.maxLength(250)] }),
    });
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdatedListener().pipe(
        takeUntil(this.destroy$)
    )
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.isLoading = false;
      });
    this.userIsAuth = this.authService.getIsAuth();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(isUserAuth => {
        this.userIsAuth = isUserAuth;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  /* Callback to handle post delete in the DB */
  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      }, error => {
        this.isLoading = false;
      });
  }

  /* Callback to handle comment saving in the DB */
  onSaveComment(postId: string) {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.postsService.addComment(postId, this.form.value.comment);
    setTimeout(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, 200);
    this.form.reset();
    this.commentInput = false;
  }

  /* Callback to handle comment deleting in the DB */
  onDeleteComment(commentId: string, postId: string) {
    if (confirm('Voullez vous supprimer ce commentaire ?')) {
      this.isLoading = true;
      this.postsService.deleteComment(commentId, postId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, error => {
          this.isLoading = false;
        });
    } else {
      return;
    }

  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSub.unsubscribe();
    this.destroy$.next(true);
  }
}
