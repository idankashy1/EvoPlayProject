import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service'; // ייבוא UserService
import { User } from '../../models/user.model'; // ייבוא המודל User

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit { // הוספת OnInit
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSmallScreen = false;
  isAdmin: boolean = false; // משתנה לבדיקת תפקיד Admin
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private userService: UserService // הזרקת UserService
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  ngOnInit(): void { // מימוש OnInit
    this.userService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'Admin' || false;
    });
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  closeMenu() {
    this.sidenav.close();
  }

  navigateToHomePage() {
    this.router.navigate(['']);
    this.closeMenu();
  }

  navigateToContactUs() {
    this.router.navigate(['/contact-us']);
    this.closeMenu();
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
    this.closeMenu();
  }

  navigateToOurPackages() {
    this.router.navigate(['/our-packages']);
    this.closeMenu();
  }

  navigateToCompanyEvents() {
    this.router.navigate(['/company-events']);
    this.closeMenu();
  }

  navigateToOurRooms() {
    this.router.navigate(['/our-rooms']);
    this.closeMenu();
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin-dashboard']);
    this.closeMenu();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  navigateToUserProfile() {
    this.router.navigate(['/user-profile']);
    this.closeMenu();
  }

  logout() {
    const confirmed = window.confirm("האם אתה בטוח שברצונך להתנתק?");
    if (confirmed) {
      this.userService.clearCurrentUser();
      this.router.navigate(['/']);
      this.snackBar.open('התנתקת בהצלחה.', '', { duration: 3000 });
      this.closeMenu();
    }
  }

  // הוספת פונקציות ניווט חסרות
  navigateToBirthdays() {
    this.router.navigate(['/company-events']); // מפנה לאותו דף
    this.closeMenu();
  }

  navigateToBachelorParty() {
    this.router.navigate(['/company-events']); // מפנה לאותו דף
    this.closeMenu();
  }

  navigateToPrivateEvents() {
    this.router.navigate(['/company-events']); // מפנה לאותו דף
    this.closeMenu();
  }
}
