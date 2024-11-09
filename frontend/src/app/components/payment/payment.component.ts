// payment.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { BookingService } from '../../services/booking.serivce';
import { BookingRequestDto } from '../../models/booking-request.dto';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service'; // הוספת UserService

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

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  bookingDetails!: BookingDetails;
  userDetailsForm!: FormGroup;

  private pricePerHour: { [key in RoomType]: number } = {
    'PS5': 30,
    'PS5VIP': 35,
    'PC': 30,
    'VR': 40
  };

  constructor(
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService // הוספת UserService לקונסטרקטור
  ) {}

  ngOnInit(): void {
    this.paymentService.getPaymentData().pipe(take(1)).subscribe(data => {
      this.bookingDetails = data;
      console.log('Booking and Package Data:', this.bookingDetails);

      // חישוב העלות הכוללת והגדרתה ב-bookingDetails
      this.bookingDetails.totalCost = this.calculateTotalCost();
      console.log('Total cost calculated in ngOnInit:', this.bookingDetails.totalCost);
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
        }
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
  
    console.log('Total cost:', totalCost);
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
      alert('אנא מלא את כל השדות הנדרשים.');
    }
  }

  private extractUserDetails(): any {
    return this.userDetailsForm.value;
  }
  
  private prepareBookingDetails(userDetails: any): BookingRequestDto {
    const startTime = `${this.bookingDetails.startDateTime.getFullYear()}-${(this.bookingDetails.startDateTime.getMonth() + 1).toString().padStart(2, '0')}-${this.bookingDetails.startDateTime.getDate().toString().padStart(2, '0')}T${this.bookingDetails.startDateTime.getHours().toString().padStart(2, '0')}:${this.bookingDetails.startDateTime.getMinutes().toString().padStart(2, '0')}:00`;
    
    const endTime = `${this.bookingDetails.endDateTime.getFullYear()}-${(this.bookingDetails.endDateTime.getMonth() + 1).toString().padStart(2, '0')}-${this.bookingDetails.endDateTime.getDate().toString().padStart(2, '0')}T${this.bookingDetails.endDateTime.getHours().toString().padStart(2, '0')}:${this.bookingDetails.endDateTime.getMinutes().toString().padStart(2, '0')}:00`;

    return {
      ...userDetails,
      resourceTypeId: this.getResourceTypeId(this.bookingDetails.roomType),
      quantity: this.calculateQuantity(this.bookingDetails.roomType),
      startTime: startTime, // שמירה על זמן ישראל
      endTime: endTime,     // שמירה על זמן ישראל
      numberOfPlayers: this.bookingDetails.numberOfPlayers,
      packageId: this.bookingDetails.selectedPackage?.id || null,
      totalCost: this.bookingDetails.totalCost || 0
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
        alert('אירעה שגיאה ביצירת ההזמנה. אנא נסה שוב.');
      }
    });
  }

  private getResourceTypeId(roomType: string): number {
    const resourceTypeMap: { [key: string]: number } = {
      'PS5': 1,
      'PS5VIP': 2,
      'PC': 3,
      'VR': 4
    };
    return resourceTypeMap[roomType] || 0;
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
}
