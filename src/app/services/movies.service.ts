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

  create(movie: Omit<Movie, 'id'>) {
    return this.http.post<Movie>(`${this.API_URL}movies`, movie)
  }

  update(id: string, movie: Movie) {
    return this.http.put<Movie>(`${this.API_URL}movies/${id}`, movie);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.API_URL}movies/${id}`);
  }

  uploadImage(file: File): Observable<{ imageUrl: string; path?: string }> {
    const formData = new FormData();
    formData.append("imagem", file);
    return this.http.post<{ imageUrl: string; path?: string }>(`${this.API_URL}upload`, formData);
  }
}
