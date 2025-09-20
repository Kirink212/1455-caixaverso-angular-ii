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

  getById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.API_URL}movies/${id}`);
  }

  create(movie: Movie) {
    return this.http.post<Movie>(`${this.API_URL}movies`, movie)
  }

  uploadImage(file: File): Observable<{ imageUrl: string; path?: string }> {
    const formData = new FormData();
    formData.append("imagem", file);
    return this.http.post<{ imageUrl: string; path?: string }>(`${this.API_URL}upload`, formData);
  }
}
