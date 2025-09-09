import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ MatToolbar, MatIcon, MatIconButton, MatButton, RouterLink ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
