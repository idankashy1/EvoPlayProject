import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  newsletterEmail: string = '';

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      // כאן תוכל להוסיף לוגיקה לשליחת האימייל לשרת
      alert('תודה שנרשמת לניוזלטר שלנו!');
      this.newsletterEmail = '';
    }
  }
}
