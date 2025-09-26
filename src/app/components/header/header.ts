import { Component, Input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [ MatToolbar, MatIcon, MatIconButton, MatButton, RouterLink, TranslateModule ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() drawer!: MatDrawer;
  currentLanguage: string;

  constructor(private authService: AuthService, private translateService: TranslateService) {
    this.currentLanguage = this.translateService.getCurrentLang() ?? 'pt-br';
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  openCartDrawer() {
    this.drawer.toggle();
  }

  logoutCurrentUser() {
    this.authService.logout();
  }

  changeLanguage(lang: string) {
    if (lang === this.currentLanguage) return;

    this.translateService.use(lang).subscribe(() => {
      this.currentLanguage = lang;
      localStorage.setItem('selectedLanguage', lang);
    });
  }
}
