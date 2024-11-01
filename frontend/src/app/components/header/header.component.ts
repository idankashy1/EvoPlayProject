import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSmallScreen = false;

  constructor(private router: Router, private breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
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

  navigateToOrderSearch() {
    this.router.navigate(['/order-search']);
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
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    this.closeMenu();
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
