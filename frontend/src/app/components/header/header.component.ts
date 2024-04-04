import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  menuOpen = false;
  isSmallScreen = false; // Set this based on the screen size

  constructor(private router: Router, private breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false; 
  }
  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
  }

  navigateToContactUs() {
    this.router.navigate(['/contact-us']);
  }

  navigateToOurRooms() {
    this.router.navigate(['/our-rooms']);
  }

  navigateToHomePage() {
    this.router.navigate(['']);
  }

  navigateToOurPackages() {
    this.router.navigate(['/our-packages']);
  }

  navigateToCompanyEvents() {
    this.router.navigate(['/company-events']);
  }
}

