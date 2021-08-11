import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/models/post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  userId: string;

  /* Properties for pagination */
  totalPosts = 0;
  postsPerPage = 3;
  pageSizeOptions = [3, 5, 10];
  currentPage = 0;
  /* propreties for authentication */
  isAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.currentPage, this.postsPerPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postsService.getPostUpdateListener().subscribe(
      (result) => {
        this.isLoading = false;
        this.posts = result.posts;
        this.totalPosts = result.totalPosts;
      },
      (error) => {
        console.log(error);
      }
    );
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.userId = this.authService.getUserId();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData);
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex;
    this.postsService.getPosts(this.currentPage, this.postsPerPage);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  onDelete(postId: string): void {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      (result) => {
        this.postsService.getPosts(this.currentPage, this.postsPerPage);
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
