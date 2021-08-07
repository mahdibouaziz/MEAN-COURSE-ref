import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() {}

  getPosts(): Post[] {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    this.posts.push({ title, content });
    this.postsUpdated.next([...this.posts]);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
