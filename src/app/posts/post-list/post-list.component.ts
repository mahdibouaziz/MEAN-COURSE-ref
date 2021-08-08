import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
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

  /* Properties for pagination */
  totalPosts = 0;
  postsPerPage = 3;
  pageSizeOptions = [3, 5, 10];
  currentPage = 0;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.currentPage, this.postsPerPage);
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
  }

  onDelete(postId: string): void {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      (result) => {
        this.postsService.getPosts(this.currentPage, this.postsPerPage);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
