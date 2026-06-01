import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  protected readonly health = signal('loading...');
  protected readonly error = signal('');

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ status: string; postgres: string; mongo: string }>('/api/health')
      .subscribe({
        next: (response) => this.health.set(JSON.stringify(response)),
        error: () => this.error.set('health check failed')
      });
  }
}