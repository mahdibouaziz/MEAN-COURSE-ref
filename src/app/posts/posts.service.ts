import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

const url = 'http://localhost:3000/api/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(): void {
    this.http.get<{ message: string; posts: Post[] }>(url).subscribe(
      (result) => {
        this.posts = result.posts;
        this.postsUpdated.next([...this.posts]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title, content };

    this.http.post(url, post).subscribe(
      (result) => {
        console.log(result);
        this.posts.push(post);
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
