import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { map } from 'rxjs/operators';

const url = 'http://localhost:3000/api/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(): void {
    this.http
      .get<{ message: string; posts: any }>(url)
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe(
        (result) => {
          this.posts = result;
          this.postsUpdated.next([...this.posts]);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title, content };

    this.http.post<{ message: string; postId: string }>(url, post).subscribe(
      (result) => {
        console.log(result);
        const postId = result.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deletePost(postId: string) {
    return this.http.delete(`${url}/${postId}`).subscribe(
      (result) => {
        const updatedPost = this.posts.filter((post) => post.id != postId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
