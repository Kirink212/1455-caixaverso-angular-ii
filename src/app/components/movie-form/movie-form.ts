import { Component, effect, EventEmitter, Input, Output, signal, Signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Movie } from '../../models/movie';

export type MovieFormValue = Omit<Movie, 'id' | 'imageLink'>;

export interface MovieFormCreateEvent {
  formValue: MovieFormValue;
  file: File;
}

export interface MovieFormUpdateEvent {
  formValue: MovieFormValue;
  movie: Movie;
  newFile: File | null;
}

@Component({
  selector: 'app-movie-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.scss'
})
export class MovieForm {
  @Input() movie: Signal<Movie | null> = signal(null);
  @Output() createMovie: EventEmitter<MovieFormCreateEvent> = new EventEmitter();
  @Output() updateMovie: EventEmitter<MovieFormUpdateEvent> = new EventEmitter();
  movieForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  fileError: string | null = null;
  isEditMode = computed(() => this.movie() !== null);

  constructor() {
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
        this.movieForm.patchValue({
          title: m.title,
          genre: m.genre,
          platform: m.platform,
          price: m.price,
          description: m.description,
          availableInStock: m.availableInStock
        });
        this.imagePreview = this.movie()?.imageLink ?? null;
        this.selectedFile = null;
        this.fileError = null;
      } else {
        this.movieForm.reset();
        this.selectedFile = null;
        this.imagePreview = null;
        this.fileError = null;
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
    const currentMovie = this.movie();

    const basePayload: MovieFormValue = {
      title: this.movieForm.value.title,
      genre: this.movieForm.value.genre,
      platform: this.movieForm.value.platform,
      price: Number(this.movieForm.value.price),
      description: this.movieForm.value.description,
      availableInStock: Number(this.movieForm.value.availableInStock)
    } as MovieFormValue;

    if (currentMovie) {
      this.fileError = null;
      this.updateMovie.emit({
        formValue: basePayload,
        movie: currentMovie,
        newFile: this.selectedFile
      });
    } else {
      if (!this.selectedFile) {
        this.fileError = 'Por favor, selecione uma imagem de poster para o filme';
        return;
      }

      this.fileError = null;
      this.createMovie.emit({
        formValue: basePayload,
        file: this.selectedFile
      });
    }
  }

  resetAfterCreate() {
    this.movieForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileError = null;
  }
}
