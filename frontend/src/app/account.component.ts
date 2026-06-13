import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  accountForm = signal({
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@gmail.com',
    phone:'+33 6 12 34 56 78'
  });

  passwordForm = signal({
    new_password: '',
    confirm_new_password: '',
    actual_password: ''
  });

  onUpdateAccount() {
    // this.http.post('/route', this.accountForm);
  }

  onUpdatePassword() {
    // this.http.post('/route', this.accountForm);
  }
}
