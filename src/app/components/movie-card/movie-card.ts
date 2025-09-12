import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../models/movie';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-movie-card',
  imports: [ MatIcon, MatIconButton, MatCardModule ],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss'
})
export class MovieCard {
  @Input() movie: Movie;

  constructor(private cartService: CartService) {
    this.movie = {
      "id": "0",
      "title": "Título do Filme",
      "genre": "Gênero do Filme",
      "platform": "Plataforma",
      "imageLink": "/assets/default_poster.png",
      "price": 0,
      "description": "Default movie description",
      "availableInStock": 0
    };
  }

  addItemToCart(movie: Movie) {    
    this.cartService.addItem(movie);
  }
}
