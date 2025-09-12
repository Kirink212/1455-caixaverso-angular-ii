import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Cart } from './components/cart/cart';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, Header, Cart, MatDrawer, MatDrawerContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('movies-ecommerce');
}
