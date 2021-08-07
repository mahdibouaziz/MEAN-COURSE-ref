import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: any;
  post: Post;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.postsService.getPost(this.postId).subscribe(
            (result: any) => {
              this.post = {
                id: result._id,
                title: result.title,
                content: result.content,
              };
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSavePost(postForm: NgForm): void {
    if (this.mode === 'create') {
      this.postsService.addPost(postForm.value.title, postForm.value.content);
    } else {
      this.postsService.updatePost(
        this.post.id,
        postForm.value.title,
        postForm.value.content
      );
    }
    postForm.resetForm();
  }
}
