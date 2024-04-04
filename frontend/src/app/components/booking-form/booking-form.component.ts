import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { MatDialog } from '@angular/material/dialog';
import { PackageSelectionComponent } from '../package-selection/package-selection.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BookingService, CheckAvailabilityRequest } from '../../services/booking.serivce'; // Update the path as necessary



@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {
 // קביעת הערכים ההתחלתיים למשתנים
 bookingDate: Date | null = null; // לא מוגדר תאריך ראשוני
 startHour: string = '17:00'; // שעת התחלה התחלתית
 endHour: string = '19:00'; // שעה סופית מוגדרת
 numberOfPlayers: number = 4; // מספר השחקנים ההתחלתי
 roomType: string = 'PS5'; // סוג החדר ההתחלתי
 startHoursOptions: string[] = []; // אופציות לבחירת שעת התחלה
 endHoursOptions: string[] = []; // אופציות לבחירת שעת סיום
 playerOptions: number[] = [2, 3, 4, 5, 6]; // ברירת מחדל לחדר PS5
 today = new Date(); // מחזיק כל פעם את היום הנוכחי

 constructor(
   private router: Router,
   private dialog: MatDialog,
   private dateAdapter: DateAdapter<Date>,
   private bookingService: BookingService,
 ) {}

 ngOnInit(): void {
  this.today.setHours(0, 0, 0, 0); // Set today with no time for comparison
  this.dateAdapter.setLocale('en-GB'); // פורמט תאריך DD/MM/YYYY

   // קריאה לפונקציה שמעדכנת את האופציות לבחירת שעות בהתאם לסוג החדר
   this.updateTimeSlotsBasedOnRoomType(this.roomType);
 }


// Method to check room availability
checkRoomAvailability(): void {
  if (this.bookingDate && this.startHour && this.endHour && this.roomType && this.numberOfPlayers) {
    const formattedDate = this.bookingDate.toISOString().split('T')[0];
    const request: CheckAvailabilityRequest = {
      date: formattedDate,
      startTime: this.createDateTimeString(this.bookingDate, this.startHour),
      endTime: this.createDateTimeString(this.bookingDate, this.endHour),
      roomType: this.roomType,
      numberOfPlayers: this.numberOfPlayers,
    };

    console.log('Checking room availability with:', request);
    
    this.bookingService.checkRoomAvailability(request).subscribe({
      next: (response) => {
        // Your existing code
      },
      error: (error) => {
        console.error('Error checking room availability:', error);
        alert('An error occurred while checking room availability. Please try again.');
      }
    });
  } else {
    console.error('Please fill all required fields to check room availability.');
  }
}

 // מאזין לתאריך ברגע שמשתנה ושומר אותו לבווקינגדייט
 dateChanged(event: MatDatepickerInputEvent<Date>): void {
  this.bookingDate = event.value;
  }

// פונקציה המגיבה לשינוי בבחירת סוג החדר
onRoomTypeChange(roomType: string): void {
  this.roomType = roomType;

  this.startHour = '17:00'; // מאתחל שעות בכל שינוי חדר 
  this.endHour = '19:00';   // מאתחל שעות בכל שינוי חדר

  this.updateTimeSlotsBasedOnRoomType(roomType);

  if (roomType === 'VR' || roomType === 'Racing Simulation') {
    this.numberOfPlayers = 1;
    this.playerOptions = roomType === 'VR' ? [1, 2, 3, 4] : [1, 2];
  } else if (roomType === 'PS5') {
    this.numberOfPlayers = 4;
    this.playerOptions = [2, 3, 4, 5, 6];
  } else {
    this.numberOfPlayers = 4;
    this.playerOptions = [2, 3, 4, 5, 6, 7, 8];
  }

  // Call to update end hours options with new start hour
  this.updateEndHoursOptions();
}

 // פונקציה המגיבה לשינוי בבחירת שעת ההתחלה
 onStartTimeChange(startHour: string): void {
   this.startHour = startHour;
   // עדכון אופציות שעת סיום בהתאם לשעת ההתחלה הנבחרת
   this.updateEndHoursOptions();
 }

 // עדכון אפשרויות שעת התחלה וסיום בהתאם לסוג החדר
// עדכון אפשרויות שעת התחלה וסיום בהתאם לסוג החדר
updateTimeSlotsBasedOnRoomType(roomType: string): void {
  // בדיקה אם החדר הוא PS5 או PS5VIP
  if (roomType === 'PS5' || roomType === 'PS5VIP') {
    // יצירת אפשרויות לשעות התחלה מ-17:00 עד 24:00
    this.startHoursOptions = this.generateHourlyTimeSlots(17, 24);
    // הוספת אפשרות להתחלה בשעה 00:00 אם אינה קיימת
    if (!this.startHoursOptions.includes('00:00')) {
      this.startHoursOptions.push('00:00');
    }
    // עדכון אפשרויות שעת סיום בהתאם
    this.updateEndHoursOptions();
  } else {
    // עבור VR ו-Racing Simulation, יצירת אפשרויות לשעות התחלה ברבעיות שעה
    this.startHoursOptions = this.generateQuarterHourlyTimeSlots(17, 26);
    // הגדרת אפשרויות שעת סיום להיות זהות לאפשרויות שעת התחלה
    this.endHoursOptions = this.startHoursOptions;
  }
  // הגדרת שעת ההתחלה והסיום לערכים הראשונים ברשימה
  this.startHour = this.startHoursOptions[0];
  this.endHour = this.endHoursOptions[0];
}

// עדכון אפשרויות לשעת סיום בהתאם לשעת התחלה שנבחרה
updateEndHoursOptions(): void {
  // מציאת אינדקס שעת ההתחלה שנבחרה ברשימה
  const startIndex = this.startHoursOptions.indexOf(this.startHour);
  // אם לא נמצאה שעת התחלה, יציאה מהפונקציה
  if (startIndex === -1) return;

  // ריקון רשימת אפשרויות שעת סיום
  this.endHoursOptions = [];

  // טיפול מיוחד לחדרי VR ו-Racing Simulation
  if (this.roomType === 'VR' || this.roomType === 'Racing Simulation') {
    // אם שעת התחלה היא 1:45, הגדרת שעת סיום ל-2:00 בלבד
    if (this.startHour === '1:45') {
      this.endHoursOptions = ['02:00'];
    } else {
      // לשאר השעות, הוספת אפשרויות ברבעיות שעה עד 1:45 וכוללת 2:00
      for (let i = startIndex + 1; i < this.startHoursOptions.length; i++) {
        if (this.startHoursOptions[i] !== '1:45') {
          this.endHoursOptions.push(this.startHoursOptions[i]);
        }
      }
      // הוספת אפשרות ל-2:00 אם אינה קיימת
      if (!this.endHoursOptions.includes('02:00')) {
        this.endHoursOptions.push('02:00');
      }
    }
  } else if (this.roomType === 'PS5' || this.roomType === 'PS5VIP') {
    // טיפול בחדרי PS5 ו-PS5VIP
    // אם שעת התחלה היא 23:00, הגבלת שעות הסיום ל-01:00 ו-02:00 בלבד
    if (this.startHour === '23:00') {
      this.endHoursOptions = ['01:00', '02:00'];
    } else {
      // לשאר השעות, הוספת אפשרויות החל משני שעות לאחר שעת ההתחלה
      let endHourIndex = startIndex + 2; // התחלה ממשך של לפחות שעתיים
      while (endHourIndex < this.startHoursOptions.length) {
        this.endHoursOptions.push(this.startHoursOptions[endHourIndex]);
        endHourIndex++;
      }
      // הבטחת כלולת אפשרויות שעת סיום שלאחר חצות
      this.ensurePostMidnightEndOptions();
    }
  }

  // איפוס שעת סיום אם היא לא קיימת באפשרויות החדשות
  if (!this.endHoursOptions.includes(this.endHour)) {
    this.endHour = this.endHoursOptions[0];
  }
}

// פונקציה להבטחת כלולת אפשרויות שעת סיום לאחר חצות
private ensurePostMidnightEndOptions() {
  // כולל את שעות 00:00, 01:00, ו-02:00 אם אינן קיימות
  ['00:00', '01:00', '02:00'].forEach(time => {
    if (!this.endHoursOptions.includes(time)) {
      this.endHoursOptions.push(time);
    }
  });
}

// יצירת רשימת זמנים לשעות שלמות בכל שעה
private generateHourlyTimeSlots(start: number, end: number): string[] {
  // יצירת רשימה של שעות בתחום הנתון, בכל שעה
  let slots: string[] = [];
  for (let hour = start; hour < end; hour++) {
    let displayHour = hour % 24; // המרה לפורמט 24 שעות
    let displayString = `${displayHour < 10 ? '0' + displayHour : displayHour}:00`;
    if (displayString !== "24:00") { // התעלמות מ-"24:00" אם קיים
      slots.push(displayString);
    }
  }
  // עבור PS5 ו-PS5VIP, הבטח שהאפשרות האחרונה להזמנה היא "00:00"
  if (slots.includes('01:00')) {
    slots = slots.filter(hour => hour !== '01:00');
  }
  return slots;
}

  // יצירת רשימת זמנים לרבעי שעה
  private generateQuarterHourlyTimeSlots(start: number, end: number): string[] {
    return this.generateTimeSlots(start, end, 15); // 15 דקות לכל רבע שעה
  }

  // יצירת רשימת זמנים בהתאם לטווח שעות והפסקה זמנית מוגדרת
  private generateTimeSlots(start: number, end: number, interval: number): string[] {
    let slots = [];
    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        let displayHour = hour % 24; // מעבר לתחילת היום אם השעה היא 24 או יותר
        let displayString = `${displayHour < 10 ? '0' + displayHour : displayHour}:${minute < 10 ? '0' + minute : minute}`;
        slots.push(displayString);
      }
    }
    return slots.filter(time => time !== "24:00"); // סינון של הזמן "24:00" אם הוא קיים
  }

  // חישוב משך הזמן של ההזמנה בשעות
  private calculateDuration(start: string, end: string): number {
    let  startTime = this.convertHourToMinutes(start);
    let  endTime = this.convertHourToMinutes(end);
      // Handle time past midnight
  if (endTime < startTime) {
    // Add 24 hours to the end time to account for the next day
    endTime += 24 * 60;
  }

    // החזרת ההפרש בשעות
    return (endTime - startTime) / 60;
  }

  // המרת מחרוזת שעה למספר דקות כוללות
  private convertHourToMinutes(hourString: string): number {
    const [hours, minutes] = hourString.split(':').map(Number);
    const adjustedHours = hours < 17 ? hours + 24 : hours;

    return adjustedHours * 60 + minutes; // כפל שעות ב-60 וחיבור הדקות
  }

// Method added here
private createDateTimeString(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = new Date(date.getTime());
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime.toISOString();
}

goToNextStep(): void {
  if (!this.bookingDate || !this.startHour || !this.endHour || !this.numberOfPlayers || !this.roomType) {
    alert('Please ensure all booking details are filled in.');
    return;
  }

  const offset = this.bookingDate.getTimezoneOffset();
  const localDate = new Date(this.bookingDate.getTime() - offset * 60 * 1000);
  const formattedDate = localDate.toISOString().split('T')[0];
  const duration = this.calculateDuration(this.startHour, this.endHour); // Duration in hours

  const request: CheckAvailabilityRequest = {
    date: formattedDate,
    startTime: this.startHour,
    endTime: this.endHour,
    roomType: this.roomType,
    numberOfPlayers: this.numberOfPlayers,
  };

  this.bookingService.checkRoomAvailability(request).subscribe({
    next: (response) => {
      console.log('Availability response:', response);
      if (response.isAvailable) {
        console.log('Room is available. Proceeding to the next step.');
        const bookingDetails = {
          bookingDate: this.bookingDate,
          startHour: this.startHour,
          endHour: this.endHour,
          numberOfPlayers: this.numberOfPlayers,
          roomType: this.roomType,
          duration: duration, // Now passing duration in hours for package selection
          roomId: response.roomId, // Store the roomId from the availability check
        };
        this.dialog.open(PackageSelectionComponent, {
          width: '600px',
          data: bookingDetails,
        });
      } else {
        alert('Selected time or room is not available. Please choose another time or room type.');
      }
    },
    error: (error) => {
      console.error('Error checking room availability:', error);
      alert('An error occurred while checking room availability. Please try again.');
    },
  });
}
}
