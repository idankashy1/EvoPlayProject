import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PackageService } from '../../services/package.service';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

// ייבוא הקומפוננטה של דיאלוג המידע
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

type RoomType = 'PS5' | 'PS5VIP' | 'PC' | 'VR';

interface BookingDetails {
  startDateTime: Date;
  endDateTime: Date;
  numberOfPlayers: number;
  roomType: RoomType;
  duration: number;
  selectedPackage?: any;
  totalCost?: number;
}

interface PackageCondition {
  name: string;
  minPlayers: number;
  minHours: number;
  rank: number; // הוספת שדה rank לציון רמת החבילה
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
  hoveredPackage: any = null; // לשימוש באפקט הריחוף

  // מחירי החדרים
  private pricePerHour: { [key in RoomType]: number } = {
    PS5: 30,
    PS5VIP: 35,
    PC: 30,
    VR: 40
  };

  constructor(
    private dialogRef: MatDialogRef<PackageSelectionComponent>,
    private packageService: PackageService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog, // הוספת MatDialog לפתיחת דיאלוג מידע
    @Inject(MAT_DIALOG_DATA) public bookingDetails: BookingDetails
  ) {}

  ngOnInit(): void {
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
        { name: 'סיבוב ראשון', minPlayers: 4, minHours: 2, rank: 1 },
        { name: 'פינוק קטן', minPlayers: 4, minHours: 2, rank: 1 },
        { name: 'התחלה חזקה', minPlayers: 4, minHours: 3, rank: 2 },
        { name: 'לילה כולל', minPlayers: 4, minHours: 4, rank: 3 },
        { name: 'יום הולדת גיימר', minPlayers: 4, minHours: 5, rank: 4 }
      ];

      this.qualifiedPackages = packagesConditions.filter(
        pkg => numberOfPlayers >= pkg.minPlayers && duration >= pkg.minHours
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
        this.availablePackages = packages.filter(pkg =>
          this.qualifiedPackages.some(qp => qp.name === pkg.name)
        );

        // מיון החבילות לפי הרמה
        this.availablePackages.sort((a, b) => {
          const rankA = this.getPackageRank(a.name);
          const rankB = this.getPackageRank(b.name);
          return rankA - rankB;
        });

        if (this.availablePackages.length === 0) {
          this.continueToPayment();
        }
      },
      error => {
        console.error('Error retrieving packages', error);
      }
    );
  }

  getPackageRank(packageName: string): number {
    const pkg = this.qualifiedPackages.find(p => p.name === packageName);
    return pkg ? pkg.rank : 0;
  }

  getRankLabel(pkg: any): string {
    const rank = this.getPackageRank(pkg.name);
    switch (rank) {
      case 1:
        return 'בסיסי';
      case 2:
        return 'מתקדם';
      case 3:
        return 'פרימיום';
      case 4:
        return 'יוקרתי';
      default:
        return '';
    }
  }

  getRankClass(pkg: any): string {
    const rank = this.getPackageRank(pkg.name);
    switch (rank) {
      case 1:
        return 'basic';
      case 2:
        return 'advanced';
      case 3:
        return 'premium';
      case 4:
        return 'luxury';
      default:
        return '';
    }
  }

  calculateTotalCost(): number {
    const { roomType, duration, numberOfPlayers } = this.bookingDetails;
    let totalCost = 0;

    if (roomType === 'VR') {
      const sessions = duration; // duration הוא כבר מספר הסשנים של 15 דקות
      totalCost = sessions * 40 * numberOfPlayers;
    } else {
      const ratePerHour = this.pricePerHour[roomType];
      totalCost = ratePerHour * duration * numberOfPlayers;
    }

    return totalCost;
  }

  calculatePricePerParticipant(): number {
    const totalCost = this.calculateTotalCost();
    const { numberOfPlayers } = this.bookingDetails;
    return totalCost / numberOfPlayers;
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

  openInfoDialog(): void {
    // פותח דיאלוג מידע
    this.dialog.open(InfoDialogComponent, {
      width: '400px',
      data: {} // תוכל להעביר נתונים אם תרצה
    });
  }
}
