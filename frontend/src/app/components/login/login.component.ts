import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service'; // ייבוא UserService
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private loginService: LoginService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private userService: UserService // הזרקת UserService
  ) {}

  onLogin(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        // Fetch user details and set in UserService
        this.userService.getMyDetails().subscribe({
          next: (user: User) => {
            this.userService.setCurrentUser(user);
            this.router.navigate(['/']); 

            // הודעת SnackBar בעת התחברות מוצלחת
            this.snackBar.open('התחברת בהצלחה!', '', { duration: 3000 });
          },
          error: (error) => {
            console.error('Failed to fetch user details after login', error);
            this.errorMessage = 'התחברות נכשלה. אנא נסה שוב.';
            this.snackBar.open('התחברות נכשלה. אנא נסה שוב.', '', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'שם משתמש או סיסמה שגויים.';
        
        // הודעת SnackBar בעת כישלון התחברות
        this.snackBar.open('התחברות נכשלה. אנא בדוק את הפרטים.', '', { duration: 3000 });
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
