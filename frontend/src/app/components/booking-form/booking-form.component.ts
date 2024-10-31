// booking-form.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; 
import { MatDialog } from '@angular/material/dialog';
import { PackageSelectionComponent } from '../package-selection/package-selection.component';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingService } from '../../services/booking.serivce';
import { CheckAvailabilityRequest, CheckAvailabilityResponse } from '../../models/check-availability.model';
import { PaymentService } from '../../services/payment.service';
import { Subscription, take } from 'rxjs';

interface BookingDetails {
  bookingDate: Date;
  startHour: string;
  endHour: string;
  numberOfPlayers: number;
  roomType: string;
  duration: number;
}

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit, OnDestroy {
  bookingDate: Date | null = null;
  startHour: string = '17:00';
  endHour: string = '19:00';
  numberOfPlayers: number = 4;
  roomType: string = 'PS5';
  startHoursOptions: string[] = [];
  endHoursOptions: string[] = [];
  playerOptions: number[] = [];
  today = new Date();
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.dateAdapter.setLocale('en-GB');
    this.updateTimeSlotsBasedOnRoomType(this.roomType);
    this.updatePlayerOptions(this.roomType);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  dateChanged(event: MatDatepickerInputEvent<Date>): void {
    this.bookingDate = event.value;
  }

  onRoomTypeChange(roomType: string): void {
    this.roomType = roomType;
    this.updateTimeSlotsBasedOnRoomType(roomType);
    this.updatePlayerOptions(roomType);
    this.updateEndHoursOptions();
  }

  onStartTimeChange(startHour: string): void {
    this.startHour = startHour;
    this.updateEndHoursOptions();
  }

  private updatePlayerOptions(roomType: string): void {
    switch (roomType) {
      case 'VR':
        this.numberOfPlayers = 1;
        this.playerOptions = [1, 2, 3, 4];
        break;
      case 'PC':
        this.numberOfPlayers = 1;
        this.playerOptions = [1, 2, 3, 4, 5];
        break;
      case 'PS5':
        this.numberOfPlayers = 4;
        this.playerOptions = [2, 3, 4, 5, 6];
        break;
      case 'PS5VIP':
        this.numberOfPlayers = 4;
        this.playerOptions = [2, 3, 4, 5, 6, 7, 8];
        break;
      default:
        this.playerOptions = [];
        break;
    }
  }

  private updateTimeSlotsBasedOnRoomType(roomType: string): void {
    if (['PS5', 'PS5VIP'].includes(roomType)) {
      this.startHoursOptions = [
        '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
      ];
    } else if (roomType === 'PC') {
      this.startHoursOptions = [
        '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00'
      ];
    } else if (roomType === 'VR') {
      this.startHoursOptions = this.generateQuarterHourlyTimeSlots(17 * 60, (2 + 24) * 60 - 15);
    }
    this.startHour = this.startHoursOptions[0];
    this.updateEndHoursOptions();
  }

  private updateEndHoursOptions(): void {
    if (!this.startHour) return;

    const startTimeMinutes = this.convertHourToMinutes(this.startHour);

    if (this.roomType === 'VR') {
      const closingTimeMinutes = (2 + 24) * 60; // 02:00 למחרת
      this.endHoursOptions = [];

      let endTimeMinutes = startTimeMinutes + 15; // מינימום 15 דקות
      while (endTimeMinutes <= closingTimeMinutes) {
        this.endHoursOptions.push(this.convertMinutesToHourString(endTimeMinutes));
        endTimeMinutes += 15; // קפיצות של 15 דקות
      }

      if (this.endHoursOptions.length === 0) {
        alert('אין זמני סיום זמינים לתחילת זמן זה. אנא בחר זמן התחלה אחר.');
        this.endHour = '';
      } else {
        this.endHour = this.endHoursOptions[0];
      }
      return;
    }

    // לחדרים אחרים
    const closingTimeMinutes = (2 + 24) * 60; // 02:00 למחרת

    let minDuration = 0;
    if (this.roomType === 'PC') {
      minDuration = 60; // שעה
    } else if (['PS5', 'PS5VIP'].includes(this.roomType)) {
      minDuration = 120; // שעתיים
    }

    let endTimeMinutes = startTimeMinutes + minDuration;
    this.endHoursOptions = [];

    while (endTimeMinutes <= closingTimeMinutes) {
      this.endHoursOptions.push(this.convertMinutesToHourString(endTimeMinutes));
      endTimeMinutes += 60; // הוספת שעה
    }

    if (this.endHoursOptions.length === 0) {
      alert('אין זמני סיום זמינים לתחילת זמן זה. אנא בחר זמן התחלה אחר.');
      this.endHour = '';
    } else {
      this.endHour = this.endHoursOptions[0];
    }
  }

  private generateQuarterHourlyTimeSlots(startMinutes: number, endMinutes: number): string[] {
    const slots = [];
    const totalMinutesInDay = 24 * 60;
    let time = startMinutes;
    while (time <= endMinutes) {
      const adjustedTime = time % totalMinutesInDay;
      const hour = Math.floor(adjustedTime / 60);
      const minute = adjustedTime % 60;
      const displayString = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
      slots.push(displayString);
      time += 15; // קפיצות של 15 דקות
    }
    return slots;
  }

  private convertHourToMinutes(hourString: string): number {
    const [hoursStr, minutesStr] = hourString.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (hours < 17) {
      // זמן אחרי חצות
      hours += 24;
    }
    return hours * 60 + minutes;
  }

  private convertMinutesToHourString(minutes: number): string {
    const totalMinutesInDay = 24 * 60;
    const adjustedMinutes = minutes % totalMinutesInDay;
    const hours = Math.floor(adjustedMinutes / 60) % 24;
    const mins = adjustedMinutes % 60;
    return `${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}`;
  }

  private calculateDuration(start: string, end: string): number {
    const startTime = this.convertHourToMinutes(start);
    let endTime = this.convertHourToMinutes(end);
    if (endTime <= startTime) {
      endTime += 24 * 60;
    }
    const durationInMinutes = endTime - startTime;
    
    // עבור חדר VR, חשב את הזמן ביחידות של 15 דקות ולא שעות
    if (this.roomType === 'VR') {
      return durationInMinutes / 15; // מחזיר את מספר הסשנים של 15 דקות
    }
  
    return durationInMinutes / 60; // עבור חדרים אחרים, מחשב לפי שעות
  }

  private createDateTimeString(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    if (hours < 17) {
      // זמן אחרי חצות
      dateTime.setDate(dateTime.getDate() + 1);
    }
    dateTime.setHours(hours % 24, minutes, 0, 0);
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
      return this.numberOfPlayers;
    } else {
      return 0;
    }
  }

  private checkIfQualifiesForPackage(bookingDetails: BookingDetails): boolean {
    const { numberOfPlayers, duration } = bookingDetails;
    return numberOfPlayers >= 4 && duration >= 2;
  }

  goToNextStep(): void {
    if (!this.bookingDate || !this.startHour || !this.endHour || !this.numberOfPlayers || !this.roomType) {
      alert('אנא ודא שכל פרטי ההזמנה מלאים.');
      return;
    }

    const startTime = this.createDateTimeString(this.bookingDate, this.startHour);
    const endTime = this.createDateTimeString(this.bookingDate, this.endHour);

    const request: CheckAvailabilityRequest = {
      resourceTypeId: this.getResourceTypeId(this.roomType),
      quantityRequested: this.calculateQuantity(this.roomType),
      startTime: startTime,
      endTime: endTime,
    };

    console.log('Checking room availability with:', request);

    this.bookingService.checkRoomAvailability(request).pipe(take(1)).subscribe({
      next: (response: CheckAvailabilityResponse) => {
        console.log('Availability response:', response);
        if (response.isAvailable) {
          console.log('Room is available. Proceeding to the next step.');
          const duration = this.calculateDuration(this.startHour, this.endHour);

          const bookingDetails: BookingDetails = {
            bookingDate: this.bookingDate!,
            startHour: this.startHour,
            endHour: this.endHour,
            numberOfPlayers: this.numberOfPlayers,
            roomType: this.roomType,
            duration: duration,
          };

          const qualifiesForPackage = this.checkIfQualifiesForPackage(bookingDetails);

          if (['PS5', 'PS5VIP', 'PC'].includes(this.roomType) && qualifiesForPackage) {
            // פותחים את PackageSelectionComponent
            this.dialog.open(PackageSelectionComponent, {
              width: '600px',
              data: bookingDetails,
            });
          } else {
            // עובר ישירות לתשלום
            this.paymentService.storePaymentData(bookingDetails);
            this.router.navigate(['/payment']);
          }
        } else {
          alert('אין משאבים זמינים בשעות אלו, אנא נסה שעות אחרות.');
        }
      },
      error: (error: any) => {
        console.error('Error checking room availability:', error);
        alert('אירעה שגיאה בבדיקת הזמינות. אנא נסה שוב.');
      },
    });
  }
}
