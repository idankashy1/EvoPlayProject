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
  errorMessage = '';

  constructor(private loginService: LoginService, private router: Router) { }

  onLogin(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Store the token as needed
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']); // Navigate to home or profile
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'שם משתמש או סיסמה שגויים.';
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
