import { Component } from '@angular/core';
import { ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  errorMessage = '';

  constructor(private forgotPasswordService: ForgotPasswordService) { }

  onSubmit(): void {
    this.forgotPasswordService.sendResetLink(this.email).subscribe({
      next: (response) => {
        this.message = 'קישור לאיפוס סיסמה נשלח לאימייל שלך.';
      },
      error: (error) => {
        console.error('Error sending reset link', error);
        this.errorMessage = 'שגיאה בשליחת הקישור. אנא נסה שוב.';
      }
    });
  }
}
