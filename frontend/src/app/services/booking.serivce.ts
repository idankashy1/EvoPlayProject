import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckAvailabilityRequest {
    date: string; // Date in YYYY-MM-DD format
    startTime: string; // Time as a string, ensure format matches backend expectation
    endTime: string; // Time as a string, ensure format matches backend expectation
    roomType: string;
    numberOfPlayers: number;
  }

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://localhost:7022/api/bookings'; // Update with the actual URL of your backend
  private apiUrl2 = 'https://localhost:7022/api/user'; // Update with the actual URL of your backend


  constructor(private http: HttpClient) {}

  // Define a model for your availability check request payload
  checkRoomAvailability(checkAvailabilityRequest: CheckAvailabilityRequest): Observable<CheckAvailabilityResponse> {
    console.log('Sending check availability request:', checkAvailabilityRequest);
    return this.http.post<CheckAvailabilityResponse>(`${this.apiUrl}/check-availability`, checkAvailabilityRequest);
  }

  createBooking(bookingDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, bookingDetails);
  }

  createUser(userDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl2}`, userDetails);
  }
}

export interface CheckAvailabilityResponse {
  message: string;
  roomId?: number; 
  isAvailable: boolean;
}
