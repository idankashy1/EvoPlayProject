// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getMyDetails().pipe(
      take(1), // קבל רק את הערך הראשון ואז סיים את ה-Observable
      map(user => {
        if (user && user.role === 'Admin') {
          return true;
        } else {
          this.router.navigate(['/']); // ניתוב לדף הבית אם לא אדמין
          return false;
        }
      })
    );
  }
}
