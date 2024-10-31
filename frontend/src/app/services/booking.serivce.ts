import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BookingRequestDto } from '../models/booking-request.dto';
import { CheckAvailabilityRequest, CheckAvailabilityResponse } from '../models/check-availability.model';

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
    return this.http.post<any>(`${this.bookingsUrl}/create-booking`, bookingDetails);
  }
}