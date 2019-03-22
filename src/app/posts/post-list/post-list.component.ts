import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // public posts = [
  //   {title: 'First post', content: 'this is the first post blablabla'},
  //   {title: 'Second post', content: 'this is the second post blablabla'},
  //   {title: 'Third post', content: 'this is the third post blablabla'},
  // ]

  posts: Post[] = [];
  private postSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdatedListener()
        .subscribe((posts$: Post[]) => {
          this.posts = posts$;
        });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
