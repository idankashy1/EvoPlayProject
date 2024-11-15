import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(
    private contactService: ContactService,
    private formBuilder: FormBuilder
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.sendContactForm(this.contactForm.value).subscribe(
        response => {
          console.log('הודעה נשלחה בהצלחה!', response);
          // ניתן להוסיף הודעת הצלחה למשתמש
        },
        error => {
          console.error('שגיאה בשליחת ההודעה!', error);
          // ניתן להוסיף הודעת שגיאה למשתמש
        }
      );
    }
  }
}
