import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckAvailabilityRequest {
  date: string; // Date in YYYY-MM-DD format
  startTime: string; // Time in HH:MM format
  endTime: string; // Time in HH:MM format
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
  private apiUrl = 'https://localhost:7022/api/bookings'; // Backend URL for bookings
  private apiUrl2 = 'https://localhost:7022/api/user'; // Backend URL for users

  constructor(private http: HttpClient) {}

  checkRoomAvailability(checkAvailabilityRequest: CheckAvailabilityRequest): Observable<CheckAvailabilityResponse> {
    return this.http.post<CheckAvailabilityResponse>(`${this.apiUrl}/check-availability`, checkAvailabilityRequest);
  }

  checkUserExists(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}/user/exists?email=${email}`);
  }
  
  createBooking(bookingDetails: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookingDetails);
  }

  createUser(userDetails: any): Observable<any> {
    return this.http.post<any>(this.apiUrl2, userDetails);
  }

  // Function to search bookings by phone number
  searchBookingsByPhoneNumber(phoneNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search-by-phone?phoneNumber=${phoneNumber}`);
  }
}