import { Component } from '@angular/core';
import { MovieForm } from '../../components/movie-form/movie-form';

@Component({
  selector: 'app-movies-registration',
  imports: [ MovieForm ],
  templateUrl: './movies-registration.html',
  styleUrl: './movies-registration.scss'
})
export class MoviesRegistration {

}
