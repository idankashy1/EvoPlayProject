import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  phoneNumber = '';
  city = '';
  address = '';
  errorMessage = '';

  constructor(
    private registerService: RegisterService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {}

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'הסיסמאות אינן תואמות.';
      return;
    }

    this.registerService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      city: this.city,
      address: this.address
    }).subscribe({
      next: (response) => {
        console.log('Registration successful', response);

        // הודעת SnackBar בעת הרשמה מוצלחת
        this.snackBar.open('נרשמת בהצלחה! התחבר כדי להמשיך.', '', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'הרישום נכשל. אנא נסה שוב.';
        
        // הודעת SnackBar בעת כישלון הרשמה
        this.snackBar.open('הרישום נכשל. אנא נסה שוב.', '', { duration: 3000 });
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
