import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { MovieForm } from '../../components/movie-form/movie-form';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movies-update',
  imports: [ MovieForm ],
  templateUrl: './movies-update.html',
  styleUrl: './movies-update.scss'
})
export class MoviesUpdate {
  movie: WritableSignal<Movie | null> = signal(null);

  constructor(private moviesService: MoviesService, private activatedRoute: ActivatedRoute) {
    const id = this.activatedRoute.snapshot.params['id'];
    this.moviesService.getById(id).subscribe((foundMovie) => {
      this.movie.set(foundMovie);
    });
  }
}
