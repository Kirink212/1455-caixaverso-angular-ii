import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
    return loggedUser != null;
  }

  loginUser(email: string, password: string): Observable<boolean> {
    if(email == "admin@admin.com" && password == "admin123") {
      localStorage.setItem("loggedUser", JSON.stringify({ token: "ABCDEFGHIJKLMNOPQ1234567" }));
      return new Observable<boolean>((subscriber) => {
        subscriber.next(true);
      });
    }

    return new Observable<boolean>((subscriber) => {
      subscriber.next(false);
    });
  }
}
