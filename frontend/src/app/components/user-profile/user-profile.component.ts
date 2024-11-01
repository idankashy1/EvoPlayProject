import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any; // מומלץ ליצור ממשק (interface) עבור המשתמש

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getMyDetails().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Failed to fetch user details', error);
      }
    });
  }
}
