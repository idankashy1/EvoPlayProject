import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { BookingService } from '../../services/booking.serivce';
import { BookingRequestDto } from '../../models/booking-request.dto';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

type RoomType = 'PS5' | 'PS5VIP' | 'PC' | 'VR';

interface BookingDetails {
  startDateTime: Date;
  endDateTime: Date;
  numberOfPlayers: number;
  roomType: RoomType;
  duration: number;
  selectedPackage?: any;
  totalCost?: number;
  roomImageUrl?: string; // הוספנו את השדה לתמונת החדר
  packageImageUrl?: string; // הוספנו את השדה לתמונת החבילה
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  bookingDetails!: BookingDetails;
  userDetailsForm!: FormGroup;
  orderSummary: any[] = [];
  selectedImage: string | null = null; // משתנה לשמירת התמונה הנבחרת

  private pricePerHour: { [key in RoomType]: number } = {
    PS5: 30,
    PS5VIP: 35,
    PC: 30,
    VR: 40,
  };

    // מיפוי בין סוג החדר לתמונת החדר
    private roomImages: { [key in RoomType]: string } = {
      PS5: 'assets/ps5ForOurRooms.jpg',
      PS5VIP: 'assets/ps5VIPForOurRooms.jpg',
      PC: 'assets/gamingPcForOurRooms.jpg',
      VR: 'assets/VRForOurRooms.png',
    };

  constructor(
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.paymentService
      .getPaymentData()
      .pipe(take(1))
      .subscribe((data) => {
        this.bookingDetails = data;
        this.bookingDetails.totalCost = this.calculateTotalCost();
        this.populateOrderSummary();
                // הוספת כתובת תמונת החדר
                this.bookingDetails.roomImageUrl = this.roomImages[this.bookingDetails.roomType];

                // הוספת כתובת תמונת החבילה אם קיימת
                this.bookingDetails.packageImageUrl = this.bookingDetails.selectedPackage?.imageUrl || null;
                this.populateOrderSummary();

      });

    // אתחול הטופס
    this.userDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: [''],
      address: [''],
    });

    const token = localStorage.getItem('token');
    if (token) {
      // אם המשתמש מחובר, נטען את הפרטים שלו ונמלא את הטופס
      this.userService.getMyDetails().subscribe({
        next: (userData) => {
          this.userDetailsForm.patchValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            city: userData.city,
            address: userData.address,
          });
        },
        error: (error) => {
          console.error('Failed to fetch user details', error);
        },
      });
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

  onPaymentSubmit(): void {
    if (this.userDetailsForm.valid) {
      const userDetails = this.extractUserDetails();
      const bookingDetails = this.prepareBookingDetails(userDetails);
      this.createBooking(bookingDetails);
    } else {
      this.snackBar.open('אנא מלא את כל השדות הנדרשים.', '', { duration: 3000 });
    }
  }

  private extractUserDetails(): any {
    return this.userDetailsForm.value;
  }

  private prepareBookingDetails(userDetails: any): BookingRequestDto {
    const startTime = this.formatDateTime(this.bookingDetails.startDateTime);
    const endTime = this.formatDateTime(this.bookingDetails.endDateTime);

    return {
      ...userDetails,
      resourceTypeId: this.getResourceTypeId(this.bookingDetails.roomType),
      quantity: this.calculateQuantity(this.bookingDetails.roomType),
      startTime: startTime,
      endTime: endTime,
      numberOfPlayers: this.bookingDetails.numberOfPlayers,
      packageId: this.bookingDetails.selectedPackage?.id || null,
      totalCost: this.bookingDetails.totalCost || 0,
    };
  }

  private createBooking(bookingDetails: BookingRequestDto): void {
    this.bookingService.createBooking(bookingDetails).subscribe({
      next: (response: any) => {
        console.log('הזמנה נוצרה בהצלחה:', response);
        this.snackBar.open('הזמנה נוצרה בהצלחה!', '', { duration: 3000 });
        this.router.navigate(['/']); // החזרה לדף הבית
      },
      error: (error: any) => {
        console.error('שגיאה ביצירת ההזמנה:', error);
        this.snackBar.open('אירעה שגיאה ביצירת ההזמנה. אנא נסה שוב.', '', { duration: 3000 });
      },
    });
  }

  private getResourceTypeId(roomType: string): number {
    const resourceTypeMap: { [key: string]: number } = {
      PS5: 1,
      PS5VIP: 2,
      PC: 3,
      VR: 4,
    };
    return resourceTypeMap[roomType] || 0;
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }

    // אופציונלי: סגירת המודל בלחיצה על מקש Escape
    @HostListener('document:keydown.escape', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
      if (this.selectedImage) {
        this.closeImageModal();
      }
    }

  private calculateQuantity(roomType: string): number {
    if (['PS5', 'PS5VIP'].includes(roomType)) {
      return 1;
    } else if (['VR', 'PC'].includes(roomType)) {
      return this.bookingDetails.numberOfPlayers;
    } else {
      return 0;
    }
  }

  private formatDateTime(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:00`;
  }

  private populateOrderSummary(): void {
    const { roomType, startDateTime, endDateTime, numberOfPlayers, selectedPackage, totalCost } = this.bookingDetails;

    this.orderSummary = [
      {
        icon: 'room_preferences',
        label: 'סוג חדר',
        value: roomType,
      },
      {
        icon: 'event',
        label: 'בתאריך',
        value: startDateTime.toLocaleDateString('he-IL'),
      },
      {
        icon: 'schedule',
        label: 'משעה',
        value: startDateTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        icon: 'schedule',
        label: 'עד שעה',
        value: endDateTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        icon: 'groups',
        label: 'כמות משתתפים',
        value: numberOfPlayers,
      },
      {
        icon: 'card_giftcard',
        label: 'שם החבילה',
        value: selectedPackage?.name || 'ללא',
      },
      {
        icon: 'attach_money',
        label: 'עלות כוללת',
        value: `${totalCost} ₪`,
      },
    ];
  }
}
