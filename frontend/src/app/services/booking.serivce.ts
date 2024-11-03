// src/app/services/booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { CheckAvailabilityRequest, CheckAvailabilityResponse } from '../models/check-availability.model';
import { BookingRequestDto } from '../models/booking-request.dto';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsUrl = 'https://localhost:7022/api/bookings';

  constructor(private http: HttpClient) {}

  checkRoomAvailability(request: CheckAvailabilityRequest): Observable<CheckAvailabilityResponse> {
    return this.http.post<CheckAvailabilityResponse>(`${this.bookingsUrl}/check-availability`, request);
  }

  createBooking(bookingDetails: BookingRequestDto): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return this.http.post<any>(`${this.bookingsUrl}`, bookingDetails, { headers });
  }

  getTodaysBookings(date: string): Observable<Booking[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Booking[]>(`${this.bookingsUrl}/today?date=${date}`, { headers });
  }
}
