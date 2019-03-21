import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:8080/api/posts')
        .subscribe((postData) => {
          this.posts = postData.posts;
          this.postUpdated.next([...this.posts]);
        });
  }

  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };
    this.http.post<{message: string}>('http://localhost:8080/api/posts', post)
        .subscribe((responseData) => {
          console.log(responseData.message);
          this.posts.push(post);
          this.postUpdated.next([...this.posts]);
        });
  }
}
