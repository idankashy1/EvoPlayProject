// package-selection.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PackageService } from '../../services/package.service';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

type RoomType = 'PS5' | 'PS5VIP' | 'PC' | 'VR';

interface BookingDetails {
  bookingDate: Date;
  startHour: string;
  endHour: string;
  numberOfPlayers: number;
  roomType: RoomType;
  duration: number;
}

interface PackageCondition {
  name: string;
  minPlayers: number;
  minHours: number;
}

@Component({
  selector: 'app-package-selection',
  templateUrl: './package-selection.component.html',
  styleUrls: ['./package-selection.component.scss']
})
export class PackageSelectionComponent implements OnInit {
  availablePackages: any[] = [];
  qualifiesForPackage: boolean = false;
  qualifiedPackages: PackageCondition[] = [];

  // מחירי החדרים
  private pricePerHour: { [key in RoomType]: number } = {
    'PS5': 30,
    'PS5VIP': 35,
    'PC': 30,
    'VR': 40
  };

  constructor(
    private dialogRef: MatDialogRef<PackageSelectionComponent>,
    private packageService: PackageService,
    private paymentService: PaymentService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public bookingDetails: BookingDetails
  ) {}

  ngOnInit(): void {
    console.log('OnInit bookingDetails', this.bookingDetails);
    this.checkQualificationForPackage();
    if (this.qualifiesForPackage) {
      this.fetchAvailablePackages();
    } else {
      this.continueToPayment();
    }
  }

  checkQualificationForPackage(): void {
    const { roomType, numberOfPlayers, duration } = this.bookingDetails;

    if (['PS5', 'PS5VIP', 'PC'].includes(roomType)) {
      const packagesConditions: PackageCondition[] = [
        { name: 'סיבוב ראשון', minPlayers: 4, minHours: 2 },
        { name: 'סיום מתוק', minPlayers: 4, minHours: 2 },
        { name: 'התחלה חזקה', minPlayers: 4, minHours: 3 },
        { name: 'לילה כולל', minPlayers: 4, minHours: 4 },
        { name: 'התחלה חזקה', minPlayers: 4, minHours: 5 }
      ];

      this.qualifiedPackages = packagesConditions.filter(pkg =>
        numberOfPlayers >= pkg.minPlayers && duration >= pkg.minHours
      );

      this.qualifiesForPackage = this.qualifiedPackages.length > 0;
    } else {
      this.qualifiesForPackage = false;
    }
  }

  fetchAvailablePackages(): void {
    const { numberOfPlayers, duration, roomType } = this.bookingDetails;

    this.packageService.getAvailablePackages(numberOfPlayers, duration, roomType).subscribe(
      packages => {
        console.log('Packages received from backend:', packages);
        console.log('Qualified packages:', this.qualifiedPackages);

        this.availablePackages = packages.filter(pkg =>
          this.qualifiedPackages.some(qp => qp.name === pkg.name)
        );
        console.log('Available Packages after filtering:', this.availablePackages);

        if (this.availablePackages.length === 0) {
          this.continueToPayment();
        }
      },
      error => {
        console.error('Error retrieving packages', error);
      }
    );
  }

  calculateTotalCost(): number {
    const { roomType, duration, numberOfPlayers } = this.bookingDetails;
    let totalCost = 0;
  
    if (roomType === 'VR') {
      const sessions = duration; // duration הוא כבר מספר הסשנים של 15 דקות
      totalCost = sessions * 40 * numberOfPlayers;
    } else {
      // חדרים אחרים: חישוב לפי שעה
      const ratePerHour = this.pricePerHour[roomType];
      totalCost = ratePerHour * duration * numberOfPlayers;
    }
  
    console.log('Total cost:', totalCost);
    return totalCost;
  }

  calculatePricePerParticipant(): number {
    const totalCost = this.calculateTotalCost();
    const { numberOfPlayers } = this.bookingDetails;
    const pricePerParticipant = totalCost / numberOfPlayers;
    console.log('Price per participant:', pricePerParticipant);
    return pricePerParticipant;
  }

  selectPackage(selectedPackage: any): void {
    const bookingDetailsWithTotalCost = {
      ...this.bookingDetails,
      selectedPackage: selectedPackage,
      totalCost: this.calculateTotalCost()
    };

    this.paymentService.storePaymentData(bookingDetailsWithTotalCost);
    this.router.navigate(['/payment']);
    this.dialogRef.close();
  }

  continueToPayment(): void {
    console.log('Continuing to payment without package...');
  
    const bookingDetailsWithTotalCost = {
      ...this.bookingDetails,
      totalCost: this.calculateTotalCost()
    };
  
    this.paymentService.storePaymentData(bookingDetailsWithTotalCost);
    this.router.navigate(['/payment']);
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
