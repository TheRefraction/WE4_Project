/**
 * account.component.ts
 */

import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  accountForm = signal({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  passwordForm = signal({
    new_password: '',
    confirm_new_password: '',
    actual_password: ''
  });

  userId: number | null = null;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.accountService.getProfile().subscribe({
      next: (res) => {
        const user = res.data;
        this.userId = user.id;
        this.accountForm.set({
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          phone: user.phone || ''
        });
      },
      error: (err) => {
        console.error('Failed to get profile:', err);
        alert('Erreur lors du chargement du profil.');
      }
    });
  }

  onUpdateAccount() {
    if (!this.userId) return;

    const data = {
      firstName: this.accountForm().first_name,
      lastName: this.accountForm().last_name,
      email: this.accountForm().email,
      phone: this.accountForm().phone || undefined
    };

    this.accountService.updateProfile(this.userId, data).subscribe({
      next: (res) => {
        alert('Compte mis à jour avec succès !');
        localStorage.setItem('currentUser', JSON.stringify(res.data));
      },
      error: (err) => {
        console.error('Failed to update account:', err);
        alert(err.error?.message || 'Erreur lors de la mise à jour.');
      }
    });
  }

  onUpdatePassword() {
    if (!this.userId) return;

    const newPwd = this.passwordForm().new_password;
    const confirmPwd = this.passwordForm().confirm_new_password;

    if (newPwd !== confirmPwd) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    if (newPwd.length < 6) {
      alert('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }

    const data = {
      password: newPwd
    };

    this.accountService.updateProfile(this.userId, data).subscribe({
      next: () => {
        alert('Mot de passe mis à jour avec succès !');
        this.passwordForm.set({
          new_password: '',
          confirm_new_password: '',
          actual_password: ''
        });
      },
      error: (err) => {
        console.error('Failed to update password:', err);
        alert(err.error?.message || 'Erreur lors du changement de mot de passe.');
      }
    });
  }
}
