import { Component } from '@angular/core';
import {  ReactiveFormsModule , FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from './services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports : [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.accountService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']); // redirige vers la page d'accueil
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur de connexion, vérifiez vos identifiants.';
      }
    });
  }

  // Getters pour les erreurs
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
