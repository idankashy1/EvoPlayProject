import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckUserExistsResponse } from '../models/check-user-exists-response.model';

export interface CheckAvailabilityRequest {
  date: string;
  startTime: string;
  endTime: string;
  roomType: string;
  numberOfPlayers: number;
}

export interface CheckAvailabilityResponse {
  message: string;
  roomId?: number;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsUrl = 'https://localhost:7022/api/bookings';
  private usersUrl = 'https://localhost:7022/api/users'; 

  constructor(private http: HttpClient) {}

  checkRoomAvailability(checkAvailabilityRequest: CheckAvailabilityRequest): Observable<CheckAvailabilityResponse> {
    return this.http.post<CheckAvailabilityResponse>(`${this.bookingsUrl}/check-availability`, checkAvailabilityRequest);
  }

  checkUserExists(email: string): Observable<CheckUserExistsResponse> {
    return this.http.get<CheckUserExistsResponse>(`${this.usersUrl}/exists?email=${encodeURIComponent(email)}`);
  }

  createBooking(bookingDetails: any): Observable<any> {
    return this.http.post<any>(this.bookingsUrl, bookingDetails);
  }

  createUser(userDetails: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, userDetails);
  }

  searchBookingsByPhoneNumber(phoneNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.bookingsUrl}/search-by-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`);
  }
}