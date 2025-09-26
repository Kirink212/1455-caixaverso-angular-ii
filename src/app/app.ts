import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Header } from './components/header/header';
import { Cart } from './components/cart/cart';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, Header, Cart, MatDrawer, MatDrawerContainer, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('movies-ecommerce');

  constructor(private authService: AuthService, private translateService: TranslateService) {
    const savedLang = localStorage.getItem('selectedLanguage')?? 'pt-br';
    this.translateService.use(savedLang);
  }

  ngOnInit(): void {
    this.authService.checkLoginExpiration();
  }
}
