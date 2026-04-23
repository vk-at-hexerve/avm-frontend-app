import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',  // Changed to app.html
  styleUrl: './app.scss'
})
export class App {  // Keep the name as 'App' since that's what main.ts expects
  title = 'avm-frontend-app';
}
