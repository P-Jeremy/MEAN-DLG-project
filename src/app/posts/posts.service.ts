import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


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

  constructor(private http: HttpClient, private router: Router) {}

  /**
   *  Get Post method
   *
   * @returns all the posts of DB through the postUpdated observable
   */
  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:8080/api/posts')
        .pipe(map((postData) => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              image: post.image
            };
          });
        }))
        .subscribe((transformedPosts) => {
          this.posts = transformedPosts;
          this.postUpdated.next([...this.posts]);
        });
  }

  /**
   * @returns the postUpdated as an observable
   */
  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  /**
   * @param takes the id of the post to edit
   *
   * @returns the post corresponding to the id
   */
  getSinglePost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, image: string}>('http://localhost:8080/api/posts/' + id);
  }

  /**
   *  Add Post method
   *
   * @param title of the post to add
   * @param content of the post to add
   *
   * @returns the response through the postUpdated observable
   */
  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message: string, post: Post}>('http://localhost:8080/api/posts', postData)
        .subscribe((responseData) => {
          const postRes: Post = {
            id: responseData.post.id,
            title,
            content,
            image: responseData.post.image
          };
          this.posts.push(postRes);
          this.postUpdated.next([...this.posts]);
          this.goHome();
        });
  }

  /**
   *  Update Post method
   *
   * @param postId Id of the post to delete
   *
   * @param title of the post
   *
   * @param content of the post
   *
   * @returns the response through the postUpdated observable
   */
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
        postData = {
          id,
          title,
          content,
          image
        };
    }
    this.http.put('http://localhost:8080/api/posts/' + id, postData)
        .subscribe((result) => {
          const updatedPosts = [...this.posts];
          const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
          const post: Post = {
            id,
            title,
            content,
            image
          };
          updatedPosts[oldPostIndex] = post;
          this.posts = updatedPosts;
          this.postUpdated.next([...this.posts]);
          this.goHome();
        });
  }

  /** Return to home page */
  goHome() {
    this.router.navigate(['/']);
  }

  /**
   *  Delete Post method
   *
   * @param postId Id of the post to delete
   *
   * @returns the response through the postUpdated observable
   */
  deletePost(postId: string) {
    this.http.delete('http://localhost:8080/api/posts/' + postId)
        .subscribe(() => {
          const updatedPosts = this.posts.filter(post =>  post.id !== postId);
          this.posts = updatedPosts;
          this.postUpdated.next([...this.posts]);
        });
  }
}
