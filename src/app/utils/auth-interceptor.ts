// auth.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // se já expirou, faça logout antes de mandar a request
  if (authService.isTokenExpired()) {
    authService.logout();
    return next(req); // segue sem header; servidor deve retornar 401
  }

  const token = authService.getToken();
  const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // token pode ter expirado entre a checagem e a requisição
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};
