import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  API_URL: string = 'http://localhost:3000/';
  movies: Array<Movie> = [];

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<Array<Movie>> {
    return this.http.get<Array<Movie>>(`${this.API_URL}movies`);
  }
}
