import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PackageService } from '../../services/package.service';
import { PaymentService } from '../../services/payment.service'; // Make sure the path is correct
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-selection',
  templateUrl: './package-selection.component.html',
  styleUrls: ['./package-selection.component.scss']
})
export class PackageSelectionComponent implements OnInit {
  availablePackages: any[] = []; // Adjust with your actual package model
  qualifiesForPackage: boolean = false;

  // Pricing per room type per hour/session
  private pricePerHourPS5 = 25;
  private pricePerHourPS5VIP = 30;
  private pricePerSessionVR = 40; // Static price per 15-minute session for VR/Racing
  
  constructor(
    private dialogRef: MatDialogRef<PackageSelectionComponent>,
    private packageService: PackageService,
    private paymentService: PaymentService, // Add this
    private router: Router, // Add this
    @Inject(MAT_DIALOG_DATA) public bookingDetails: any // The actual type for booking details should be used here
  ) {}

  ngOnInit(): void {
    console.log('OnInit bookingDetails', this.bookingDetails);
    this.checkQualificationForPackage();
    if (this.qualifiesForPackage) {
      this.fetchAvailablePackages();
    }
  }

  checkQualificationForPackage(): void {
    // Assuming you gift a package for bookings of at least 2 hours with 4 or more people
    const minimumHours = 2;
    const minimumPeople = 4;

    const { numberOfPlayers, duration } = this.bookingDetails;
    this.qualifiesForPackage = duration >= minimumHours && numberOfPlayers >= minimumPeople;
  }
  
  fetchAvailablePackages(): void {
    const { numberOfPlayers, duration } = this.bookingDetails;
    this.packageService.getAvailablePackages(numberOfPlayers, duration).subscribe(
      packages => {
        this.availablePackages = packages.map(pkg => ({
          ...pkg,
          imageUrl: pkg.imageUrl.startsWith('assets/') ? `./${pkg.imageUrl}` : pkg.imageUrl
        }));
        console.log('Available Packages:', this.availablePackages);
      },
      error => {
        console.error('Error retrieving packages', error);
      }
    );
  }

  calculatePricePerParticipant(): number {
    const { roomType, duration } = this.bookingDetails;
    const sessions = this.calculateSessions(duration);
    const rate = this.getRoomRate(roomType, sessions);
    console.log('Price per participant:', rate);
    return rate;
  }

  calculateTotalCost(): number {
    const { roomType, duration, numberOfPlayers } = this.bookingDetails;
    const sessions = this.calculateSessions(duration);
    const rate = this.getRoomRate(roomType, sessions);
    const totalCost = rate * numberOfPlayers;
    console.log('Total cost:', totalCost);
    return totalCost;
  }

  private calculateSessions(duration: number): number {
    // Assuming each session is 15 minutes, so 4 sessions make an hour
    return duration / 0.25;
  }

  private getRoomRate(roomType: string, sessions: number): number {
    switch(roomType) {
      case 'PS5':
        // For PS5, the rate is based on the duration in hours
        return this.pricePerHourPS5 * sessions * 0.25;
      case 'PS5VIP':
        // For PS5VIP, the rate is also based on the duration in hours
        return this.pricePerHourPS5VIP * sessions * 0.25;
      case 'VR':
      case 'Racing Simulation':
        // For VR and Racing Simulation, the rate is per session
        return this.pricePerSessionVR * sessions;
      default:
        console.error('Unrecognized room type:', roomType);
        return 0;
    }
  }

  selectPackage(selectedPackage: any): void {
    // ... other logic for selecting a package
    
    // Calculate total cost and store data before navigating to payment
    const bookingDetailsWithTotalCost = {
      ...this.bookingDetails,
      selectedPackage: selectedPackage,
      totalCost: this.calculateTotalCost()
    };
  
    this.paymentService.storePaymentData(bookingDetailsWithTotalCost);
  
    // Now navigate to the payment page
    this.router.navigate(['/payment']);
    this.dialogRef.close();
  }

  continueToPayment(): void {
    console.log('Continuing to payment without package...');
  
    // Calculate total cost even when no package is selected
    const bookingDetailsWithTotalCost = {
      ...this.bookingDetails,
      totalCost: this.calculateTotalCost()
    };
  
    // Store the booking details along with the total cost
    this.paymentService.storePaymentData(bookingDetailsWithTotalCost);
  
    // Close the dialog and navigate to the payment page
    this.router.navigate(['/payment']);
    this.dialogRef.close();
  }
  closeDialog(): void {
    this.dialogRef.close(); // This will close the dialog
  }
}
