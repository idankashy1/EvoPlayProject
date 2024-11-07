import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7022/api/users'; // עדכן ל-URL של ה-API שלך
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // אתחול currentUserSubject על בסיס קיים של token
    const token = localStorage.getItem('token');
    if (token) {
      this.getMyDetails().subscribe({
        next: (user: User) => {
          this.currentUserSubject.next(user);
        },
        error: (error) => {
          console.error('Failed to fetch user details on service init', error);
          this.currentUserSubject.next(null);
        }
      });
    }
  }

  getMyDetails(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User>(`${this.apiUrl}/me`, { headers });
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  redeemReward(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/redeem-reward`, {}, { headers });
  }

  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User[]>(`${this.apiUrl}`, { headers });
  }

  searchUsers(username: string, phone: string): Observable<User[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if (username) {
      params = params.set('username', username);
    }
    if (phone) {
      params = params.set('phone', phone);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User[]>(`${this.apiUrl}/search`, { headers, params });
  }

  clearCurrentUser() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('token');
    // הוספת לוגיקה נוספת אם נדרש
  }
}
