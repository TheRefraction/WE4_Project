import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  menuOpen = false;

  constructor(public accountService: AccountService) {}

  onLogout(): void {
    this.accountService.logout();
    this.menuOpen = false;
  }

  get isLoggedIn(): boolean {
    return this.accountService.isLoggedIn();
  }
}
