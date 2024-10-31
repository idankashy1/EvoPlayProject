// payment.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { BookingService } from '../../services/booking.serivce';
import { BookingRequestDto } from '../../models/booking-request.dto';
import { take } from 'rxjs/operators';

type RoomType = 'PS5' | 'PS5VIP' | 'PC' | 'VR';

interface BookingDetails {
  bookingDate: Date;
  startHour: string;
  endHour: string;
  numberOfPlayers: number;
  roomType: RoomType; // שינינו מ-string ל-RoomType
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
  

  // מחירי החדרים
  private pricePerHour: { [key in RoomType]: number } = {
    'PS5': 30,
    'PS5VIP': 35,
    'PC': 30,
    'VR': 40
  };

  constructor(
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private fb: FormBuilder
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
  }

  calculateTotalCost(): number {
    const { roomType, duration, numberOfPlayers } = this.bookingDetails;
    const rate = this.pricePerHour[roomType] * duration * numberOfPlayers;
    console.log('Total cost:', rate);
    return rate;
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

      // קריאה ליצירת ההזמנה
      this.bookingService.createBooking(bookingDetails).subscribe({
        next: (response: any) => {
          console.log('הזמנה נוצרה בהצלחה:', response);
          // נווט לעמוד אישור או הצג הודעת הצלחה
          // this.router.navigate(['/confirmation']);
        },
        error: (error: any) => {
          console.error('שגיאה ביצירת ההזמנה:', error);
          alert('אירעה שגיאה ביצירת ההזמנה. אנא נסה שוב.');
        }
      });
    } else {
      alert('אנא מלא את כל השדות הנדרשים בטופס.');
    }
  }

  private extractUserDetails(): any {
    return this.userDetailsForm.value;
  }

  private prepareBookingDetails(userDetails: any): BookingRequestDto {
    const startTime = this.createDateTimeString(this.bookingDetails.bookingDate, this.bookingDetails.startHour);
    const endTime = this.createDateTimeString(this.bookingDetails.bookingDate, this.bookingDetails.endHour);

    return {
      ...userDetails,
      resourceTypeId: this.getResourceTypeId(this.bookingDetails.roomType),
      quantity: this.calculateQuantity(this.bookingDetails.roomType),
      startTime: startTime,
      endTime: endTime,
      numberOfPlayers: this.bookingDetails.numberOfPlayers,
      packageId: this.bookingDetails.selectedPackage?.id || null,
      totalCost: this.bookingDetails.totalCost
    };
  }

  private createDateTimeString(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime.toISOString();
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
