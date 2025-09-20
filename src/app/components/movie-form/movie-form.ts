import { Component, effect, EventEmitter, inject, Input, Output, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MoviesService } from '../../services/movies.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.scss'
})
export class MovieForm {
  private moviesService: MoviesService;
  private snackBar: MatSnackBar;

  @Input() movie: Signal<Movie | null> = signal(null);
  @Output() submitEvent: EventEmitter<void> = new EventEmitter();
  movieForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  fileError: string | null = null;

  constructor() {
    this.moviesService = inject(MoviesService);
    this.snackBar = inject(MatSnackBar);

    this.movieForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      genre: new FormControl('', [Validators.required]),
      platform: new FormControl('', [Validators.required]),
      // imageLink: new FormControl('', [
      //   Validators.required,
      //   // http/https + qualquer coisa não em branco
      //   Validators.pattern(/^https?:\/\/\S+$/i)
      // ]),
      price: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0.01) // positivo
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(300)
      ]),
      availableInStock: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1) // positivo (>=1)
      ])
    });

    effect(() => {
      const m = this.movie();
      if (m) {
        this.movieForm.patchValue({ ...this.movie() });
        this.imagePreview = this.movie()?.imageLink?? null;
      } else {
        this.movieForm.reset();
      }
    });
  }

  onFileSelected(evt: Event) {
    this.fileError = null;
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    // Validação simples do arquivo
    if (!file.type.startsWith('image/')) {
      this.fileError = 'Por favor, selecione um arquivo do tipo imagem';
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    // (Opcional) limite de tamanho, ex.: 5MB
    const MAX = 5 * 1024 * 1024;
    if (file.size > MAX) {
      this.fileError = 'Imagem pode ter no máximo 5MB';
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    this.selectedFile = file;

    // preview
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  submitForm() {
    if (!this.movieForm.valid) {
      this.movieForm.markAllAsTouched();
      return;
    }
    if (!this.selectedFile) {
      this.fileError = 'Por favor, selecione uma imagem de poster para o filme';
      return;
    }

    // this.submitEvent.emit(this.selectedFile, this.movieForm.value);

    this.moviesService
      .uploadImage(this.selectedFile)
      .pipe(
        switchMap(({ imageUrl }) => {
          const movieObj = {
            ...this.movieForm.value,
            imageLink: imageUrl
          };

          return this.moviesService.create(movieObj);
        })
      ).subscribe({
        next: (movie) => {
          console.log(movie);

          this.selectedFile = null;
          this.imagePreview = null;
          this.fileError = null;

          this.snackBar.open('Filme adicionado com sucesso!', 'Fechar', {
            horizontalPosition: "end",
            verticalPosition: "top",
            duration: 3000
          });
        },
        error: (err) => console.error(err)
      });
  }
}
