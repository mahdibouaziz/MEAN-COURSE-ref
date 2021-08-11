import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/models/post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private postId: any;
  form: FormGroup;
  post: Post;
  isLoading = false;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          // show the spinner
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(
            (result: any) => {
              // remove the spinner
              this.isLoading = false;
              this.post = {
                id: result._id,
                title: result.title,
                content: result.content,
                imagePath: result.imagePath,
                creator: null,
              };
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath,
              });
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

  onSavePost(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.post.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
