import { Component, Input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [ MatToolbar, MatIcon, MatIconButton, MatButton, RouterLink ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() drawer!: MatDrawer;

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  openCartDrawer() {
    this.drawer.toggle();
  }

  logoutCurrentUser() {
    this.authService.logout();
  }
}
