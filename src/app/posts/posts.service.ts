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
  private postsUpdated = new Subject<{ posts: Post[]; totalPosts: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(currentPage: number, postsPerPage: number): void {
    const queryParams = `?page=${currentPage}&postsPerPage=${postsPerPage}`;
    this.http
      .get<{
        totalPages: number;
        totalPosts: number;
        currentPage: number;
        posts: any;
      }>(url + queryParams)
      .pipe(
        map((postData) => {
          return {
            totalPages: postData.totalPages,
            totalPosts: postData.totalPosts,
            currentPage: postData.currentPage,
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
          };
        })
      )
      .subscribe(
        (result) => {
          this.posts = result.posts;
          this.postsUpdated.next({
            posts: [...this.posts],
            totalPosts: result.totalPosts,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: '', title, content };

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string; post: Post }>(url, postData).subscribe(
      (result) => {
        this.router.navigate(['/']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deletePost(postId: string) {
    return this.http.delete(`${url}/${postId}`);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'string') {
      postData = { id, title, content, imagePath: image };
    } else {
      postData = new FormData();
      postData.append('title', title);
      postData.append('id', id);
      postData.append('content', content);
      postData.append('image', image, title);
    }
    this.http.put(`${url}/${id}`, postData).subscribe(
      (result: any) => {
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
