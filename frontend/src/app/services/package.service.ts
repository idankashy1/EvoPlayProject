import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = 'https://localhost:7022/api/packages'; // Update with the actual URL of your backend

  constructor(private http: HttpClient) {}

  getAllPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getAvailablePackages(numberOfPlayers: number, hours: number): Observable<any[]> { // You can replace any[] with a more specific model if you have it
    const params = new HttpParams()
      .set('NumberOfPlayers', numberOfPlayers.toString())
      .set('Duration', hours.toString());
      console.log(`Sending request with NumberOfPlayers: ${numberOfPlayers}, Duration: ${hours}`); // Debugging line

    return this.http.get<any[]>(`${this.apiUrl}/available`, { params });
  }
}