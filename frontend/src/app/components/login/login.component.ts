import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private loginService: LoginService, private router: Router) { }

  onLogin(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Store the token as needed
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']); // Adjust as needed
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token'); // This removes the token from local storage
    this.router.navigate(['/login']); // Adjust if your login route is different
  }
}
