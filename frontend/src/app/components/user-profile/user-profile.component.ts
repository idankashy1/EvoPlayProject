import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog'; // ייבוא MatDialog
import { RewardsInfoDialogComponent } from '../rewards-info-dialog/rewards-info-dialog.component'; // ייבוא הקומפוננטה החדשה

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city?: string;
  address?: string;
  totalPoints: number;
  currentPoints: number;
  availableRewards: number;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user!: User;
  markers: number[] = [];

  constructor(
    private userService: UserService,
    private dialog: MatDialog // הוספת MatDialog לקונסטרקטור
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    // יצירת מערך של סימני ציון ב-10 שלבים
    this.markers = Array.from({ length: 11 }, (_, i) => i * 10);
  }

  loadUserData(): void {
    this.userService.getMyDetails().subscribe({
      next: (data: User) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Failed to fetch user details', error);
      },
    });
  }

  openRewardsInfo(): void {
    this.dialog.open(RewardsInfoDialogComponent, {
      width: '400px',
    });
  }
}
