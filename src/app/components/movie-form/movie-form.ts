import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-movie-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.scss'
})
export class MovieForm {
  movieForm: FormGroup
  constructor() {
    this.movieForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      genre: new FormControl('', [Validators.required]),
      platform: new FormControl('', [Validators.required]),
      imageLink: new FormControl('', [
        Validators.required,
        // http/https + qualquer coisa não em branco
        Validators.pattern(/^https?:\/\/\S+$/i)
      ]),
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
  }

  submitForm() {
    if (this.movieForm.valid) {
      console.log(this.movieForm.value);
      this.movieForm.reset();
    } else {
      this.movieForm.markAllAsTouched();
    }
  }
}
