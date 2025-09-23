import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../models/movie';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MoviesService } from '../../services/movies.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs';

@Component({
  selector: 'app-movie-card',
  imports: [ MatIcon, MatIconButton, MatCardModule, RouterLink, MatDialogModule ],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss'
})
export class MovieCard {
  @Input() movie: Movie;
  @Output() deleteMovie: EventEmitter<string> = new EventEmitter<string>();

  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private moviesService = inject(MoviesService);

  constructor(private cartService: CartService, private snackBar: MatSnackBar) {
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
    const done = this.cartService.addItem(movie);
    if (!done) {
      this.snackBar.open('Não é possível adicionar este filme ao carrinho.', 'Fechar', {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(MovieDeleteConfirmationDialog, {
      data: {
        title: this.movie.title
      }
    });

    dialogRef.afterClosed()
      .pipe(filter((confirmed) => confirmed))
      .subscribe(() => {
        this.moviesService.delete(this.movie.id).subscribe({
          next: () => {
            this.snackBar.open('Filme excluído com sucesso!', 'Fechar', {
              horizontalPosition: "end",
              verticalPosition: "top",
              duration: 3000
            });
            this.deleteMovie.emit(this.movie.id);
          },
          error: () => {
            this.snackBar.open('Não foi possível excluir o filme.', 'Fechar', {
              horizontalPosition: "end",
              verticalPosition: "top",
              duration: 3000
            });
          }
        });
      });
  }
}

@Component({
  selector: 'app-movie-delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Excluir filme</h2>
    <mat-dialog-content>Tem certeza de que deseja excluir "{{ data.title }}"?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">Cancelar</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Excluir</button>
    </mat-dialog-actions>
  `
})
export class MovieDeleteConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string }) {}
}
