import { Component, Input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ MatToolbar, MatIcon, MatIconButton, MatButton, RouterLink ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() drawer!: MatDrawer;

  openCartDrawer() {
    this.drawer.toggle();
  }
}
