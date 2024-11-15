import { Component, OnInit } from '@angular/core';

interface Room {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-our-rooms',
  templateUrl: './our-rooms.component.html',
  styleUrls: ['./our-rooms.component.scss'],
})
export class OurRoomsComponent implements OnInit {
  rooms: Room[] = [];
  showImagePopup: boolean = false;
  popupImageUrl: string = '';

  ngOnInit() {
    this.rooms = [
      {
        title: 'חדר Gaming PC',
        description: `ברוכים הבאים למתחם עמדות המחשב של EvoPlay! זה המקום שבו תוכלו לשקוע בעולם המשחקים המתקדם ביותר וליהנות ממחשבי גיימינג מקצועיים עם ביצועים גבוהים. המתחם מאובזר בציוד גיימינג חדשני, כולל מסכים באיכות מעולה, כרטיסי גרפיקה חזקים, ומגוון משחקים מובילים.`,
        image: 'assets/gamingPcForOurRooms.jpg',
      },
      {
        title: 'חדר PS5 VIP',
        description: `חדרי ה-PS5 VIP הם בדיוק המקום לכל אותם שחקנים שמחפשים לבלות עם החבר'ה בפרטיות מוחלטת בחדר יוקרתי ומאובזר. החדרים מעניקים תחושה נהדרת עם מערכת סאונד מצוינת וטלוויזיות LED גדולות ואיכותיות במיוחד.`,
        image: 'assets/ps5VIPForOurRooms.jpg',
      },
      {
        title: 'חדר VR',
        description: `הדובדבן שבקצפת - בחדר המציאות המדומה שלנו תוכלו לחוות חוויה יוצאת דופן עם מערכות VR מתקדמות. עם הליכונים וציוד טכנולוגי מהשורה הראשונה, תרגישו כאילו יצאתם מהעולם המציאותי ונכנסתם לעולם וירטואלי מרתק.`,
        image: 'assets/VRForOurRooms.png',
      },
      {
        title: 'מתחם PS5',
        description: `מתחם ה-PS5 הוא הלב הפועם של EvoPlay. זהו מקום שבו תוכלו ליהנות מפרטיות עם עיצוב מרשים וחדשני. החדר עטוף בקירות זכוכית ובידוד אקוסטי מעולה שמבטיח שום הפרעות, עם אבזור משחקים מהשורה הראשונה.`,
        image: 'assets/ps5ForOurRooms.jpg',
      },
    ];
  }

  openImagePopup(imageUrl: string): void {
    this.popupImageUrl = imageUrl;
    this.showImagePopup = true;
  }

  closeImagePopup(): void {
    this.showImagePopup = false;
  }
}
