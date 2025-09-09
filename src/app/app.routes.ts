import { Routes } from '@angular/router';
import { MoviesList } from './pages/movies-list/movies-list';
import { MoviesRegistration } from './pages/movies-registration/movies-registration';

export const routes: Routes = [
    { path: "", component: MoviesList },
    { path: "register", component: MoviesRegistration },
];
