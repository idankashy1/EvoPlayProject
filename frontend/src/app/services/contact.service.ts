
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactForm } from '../models/contact-form.model'; // Make sure the path is correct

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://localhost:7022/Contact';

  constructor(private http: HttpClient) { }

  sendContactForm(contactForm: ContactForm): Observable<any> { // Use any or create a response model
    return this.http.post(this.apiUrl, contactForm);
  }
}