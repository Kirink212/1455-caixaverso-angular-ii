import { Routes } from '@angular/router';

import { MoviesList } from './pages/movies-list/movies-list';
import { MoviesRegistration } from './pages/movies-registration/movies-registration';
import { MoviesUpdate } from './pages/movies-update/movies-update';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: "", redirectTo: "movies", pathMatch: "full" },
    { path: "login", component: Login },
    { path: "movies", component: MoviesList },
    { path: "movies/register", component: MoviesRegistration, canActivate: [authGuard] },
    { path: "movies/update/:id", component: MoviesUpdate, canActivate: [authGuard] },
    { path: "**", component: NotFound },
];