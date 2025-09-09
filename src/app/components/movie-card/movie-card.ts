import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-movie-card',
  imports: [ MatCardModule ],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss'
})
export class MovieCard {

}
