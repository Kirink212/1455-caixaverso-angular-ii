import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private snackBar: MatSnackBar;
  private authService: AuthService;
  private router: Router;

  loginForm: FormGroup;
  emailError: string = "";
  passwordError: string = "Senha inválida.";

  constructor() {
    this.snackBar = inject(MatSnackBar);
    this.authService = inject(AuthService);
    this.router = inject(Router);
    
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  updateEmailErrorMessage() {
    if (this.loginForm.controls["email"].hasError('required')) {
      this.emailError = 'Campo e-mail deve ser preenchido';
    } else if (this.loginForm.controls["email"].hasError('email')) {
      this.emailError = 'Campo e-mail inválido';
    } else {
      this.emailError = '';
    }
  }

  submitForm() {

    this.authService.loginUser(
      this.loginForm.get("email")?.value, 
      this.loginForm.get("password")?.value
    ).subscribe({
      next: (isLoggedIn: boolean) => {   
        if (!isLoggedIn) {
          this.snackBar.open(
            "Não foi possível logar. Tente novamente com credenciais válidas!",
            "Fechar",
            {
              horizontalPosition: "end",
              verticalPosition: "top",
              duration: 3000,
            }
          );
          return;
        }

        this.snackBar.open(
          "Login realizado com sucesso!",
          "Fechar",
          {
            horizontalPosition: "end",
            verticalPosition: "top",
            duration: 3000,
          }
        );

        this.authService.scheduleLogout();

        this.router.navigate(['']);
      },
      error: (err) => {
        this.snackBar.open(
          "Login inválido. Por favor, digite credenciais válidas!",
          "Fechar",
          {
            horizontalPosition: "end",
            verticalPosition: "top",
            duration: 3000,
          }
        );
      }
    });
  }
}
