import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


/* POST interface */
import { Post } from '../models/post.model';

import { environment } from '../../environments/environment';

const API_DOMAIN = environment.apiDomain + '/posts/';

/*
* Makes the service available at all 'root' levels of the application.
* Wich means everywhere on the SPA
*/
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private postStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) { }

  /**
   *  Get Post method
   *
   * @param postsPerPage allows to handle pagination through a query
   *
   * @param currentPage allows to handle pagination through a query
   *
   * @returns all the posts of DB through the postUpdated observable
   */
  getPosts(postsPerPage: number, currentPage: number) {
    const queryPaginationParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>(API_DOMAIN + queryPaginationParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            const postDate = new Date(post.updatedAt).toLocaleDateString();
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              image: post.image,
              creator_id: post.creator_id,
              creator_pseudo: post.creator_pseudo,
              date: postDate,
              comments: post.comments
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
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
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      image: string,
      creator_id: string,
      creator_pseudo: string
      date: Date
    }>(API_DOMAIN + id);
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

    this.http.post<{ message: string, post: Post }>(API_DOMAIN, postData)
      .subscribe(() => {
        this.postStatusListener.next(true);
        this.redirect(['/post']);
      },
        error => {
          this.postStatusListener.next(false);
          this.redirect(['/post']);
        });
  }

  addComment( postId: string, comment: string) {
    const commentData = {
      comment
    };
    return this.http.post<{ message: string, post: Post }>(`${API_DOMAIN}/comment/` + postId, commentData)
      .subscribe((result) => {
        this.postStatusListener.next(true);
        this.redirect(['/post']);
      });
  }

  /**
   * Mehthod that handles comment delete
   * @param commentId id of the comment
   * @param postId id of the post wich the comment is related to
   */
  deleteComment( commentId: string, postId: string) {
    return this.http.delete(`${API_DOMAIN}/comment/${commentId}/${postId}`);
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
   * @param image of the post
   *
   * @returns the response through the postUpdated observable
   */
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    /* If updated post has a new image as a file */
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      /* Else, image === url as a string */
    } else {
      postData = {
        id,
        title,
        content,
        image,
        creator_id: null,
        creator_pseudo: null,
        date: null
      };
    }
    this.http.put(API_DOMAIN + id, postData)
      .subscribe(() => {
        this.redirect(['/post']);
      });
  }

  /** Return to home page */
  redirect(to: any[]) {
    this.router.navigate(to);
  }

  /**
   *  Delete Post method
   *
   * @param postId Id of the post to delete
   */
  deletePost(postId: string) {
    return this.http.delete(API_DOMAIN + postId);
  }
}
