import { Component, ViewChild, inject } from '@angular/core';
import { switchMap } from 'rxjs';

import { MovieForm, MovieFormCreateEvent } from '../../components/movie-form/movie-form';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movies-registration',
  imports: [ MovieForm ],
  templateUrl: './movies-registration.html',
  styleUrl: './movies-registration.scss'
})
export class MoviesRegistration {
  @ViewChild(MovieForm) movieForm?: MovieForm;

  private readonly moviesService = inject(MoviesService);
  private readonly snackBar = inject(MatSnackBar);

  handleCreateMovie(event: MovieFormCreateEvent) {
    const { formValue, file } = event;

    this.moviesService
      .uploadImage(file)
      .pipe(
        switchMap(({ imageUrl }) => {
          const payload: Omit<Movie, 'id'> = {
            ...formValue,
            imageLink: imageUrl
          };

          return this.moviesService.create(payload);
        })
      )
      .subscribe({
        next: () => {
          this.movieForm?.resetAfterCreate();
          this.snackBar.open('Filme adicionado com sucesso!', 'Fechar', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000
          });
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('Não foi possível adicionar o filme.', 'Fechar', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000
          });
        }
      });
  }

}
