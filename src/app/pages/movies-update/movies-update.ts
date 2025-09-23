import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, switchMap } from 'rxjs';

import { MovieForm, MovieFormUpdateEvent } from '../../components/movie-form/movie-form';
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

  constructor(
    private moviesService: MoviesService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    const id = this.activatedRoute.snapshot.params['id'];
    this.moviesService.getById(id).subscribe((foundMovie) => {
      this.movie.set(foundMovie);
    });
  }

  handleUpdateMovie(event: MovieFormUpdateEvent) {
    const { formValue, movie, newFile } = event;

    let update$: Observable<Movie>;

    if (newFile) {
      update$ = this.moviesService.uploadImage(newFile).pipe(
        switchMap(({ imageUrl }) => {
          const payload: Movie = {
            ...formValue,
            id: movie.id,
            imageLink: imageUrl
          };

          return this.moviesService.update(movie.id, payload);
        })
      );
    } else {
      const payload: Movie = {
        ...formValue,
        id: movie.id,
        imageLink: movie.imageLink
      };

      update$ = this.moviesService.update(movie.id, payload);
    }

    update$.subscribe({
      next: (updatedMovie) => {
        this.movie.set(updatedMovie);
        this.snackBar.open('Filme atualizado com sucesso!', 'Fechar', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open('Não foi possível atualizar o filme.', 'Fechar', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      }
    });
  }
}
