import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;
  post: Post;
  isLoading = false;
  imagePreview: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
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
              };
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
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
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.post.id,
        this.form.value.title,
        this.form.value.content
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
