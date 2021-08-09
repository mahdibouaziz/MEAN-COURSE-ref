import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      (result) => {
        this.isAuthenticated = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}
