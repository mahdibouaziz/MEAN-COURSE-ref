import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const url = 'http://localhost:3000/api/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

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
        this.router.navigate(['/']);
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

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.put(`${url}/${id}`, post).subscribe(
      (result) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get(`${url}/${postId}`);
    // return { ...this.posts.find((post) => post.id === postId) };
  }
}
