import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../models/movie';
import { MoviesService } from '../../services/movies.service';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-movies-list',
  imports: [ MovieCard ],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.scss'
})
export class MoviesList implements OnInit {
  movies: Array<Movie> = [];

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.moviesService.getAll().subscribe((movies) => {
      this.movies = movies;
    });
  }

  onMovieDeleted(id: string) {
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }
}
