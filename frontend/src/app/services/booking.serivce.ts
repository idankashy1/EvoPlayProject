// src/app/services/booking.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.get<Booking[]>(`${this.bookingsUrl}/today`, { params: { date }, headers });
  }

  searchBookings(searchTerm: string): Observable<Booking[]> {
    if (!searchTerm.trim()) {
      const today = new Date().toISOString().split('T')[0];
      return this.getTodaysBookings(today);
    }

    const params = new HttpParams().set('searchTerm', searchTerm);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Booking[]>(`${this.bookingsUrl}/search`, { params, headers });
  }

  getBookingsByDateRange(from: Date, to: Date): Observable<Booking[]> {
    const params = new HttpParams()
      .set('from', from.toISOString())
      .set('to', to.toISOString());
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Booking[]>(`${this.bookingsUrl}/daterange`, { params, headers });
  }
}
