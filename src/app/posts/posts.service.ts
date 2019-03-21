import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/* POST interface */
import { Post } from './post.model';

/*
* Makes the service available at all 'root' levels of the application.
* Wich means everywhere on the SPA
*/
@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();


  getPosts() {
    return [...this.posts];
  }

  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    const post: Post = {
      title,
      content
    };
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }
}
