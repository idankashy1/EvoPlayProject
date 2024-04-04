import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-rooms',
  templateUrl: './our-rooms.component.html',
  styleUrls: ['./our-rooms.component.scss']
})
export class OurRoomsComponent implements OnInit {
  ps5VIPText: string;
  ps5Text: string;
  simulatorText: string;
  vrText: string;


  constructor() {
    this.ps5VIPText = ''; 
    this.ps5Text = ''; 
    this.simulatorText = ''; 
    this.vrText = ''; 
  }

  ngOnInit() {
    this.ps5Text = `מתחם הסוני פלייסטיישן הוא הלב הפועם של איבופליי, זהו מקום שבו תוכלו להינות מפרטיות עם עיצוב מרשים וחדשני,
    החדר עטוף בקירות זכוכית ובידוד אקוסטי מעולה שמבטיח שום הפרעות. נוסף על כך, אבזור המשחקים מהשורה הראשונה וכל זה כדי להבטיח לכם את החוויה המושלמת!
    אז, ישיבה טובה עם החבר'ה, עם בירות ונשנושים ומפה הכדור עובר לידיים שלכם.`.replace(/\.\s/g, ".\n");

    this.ps5VIPText = `חדרי הפלייסטיישן וי אי פי הם בדיוק המקום לכל אותם שחקנים שמחפשים לבלות עם החבר'ה בפרטיות מוחלטת בחדר יוקרתי ומבאובזר,
    החדרים הפרטיים של איבופליי מעניקים תחושה נהדרת לשחקנים עם מערכת סאונד מצוינת וטלוויזית לד גדולה ואיכותית במיוחד, בנוסף לכך גודלו של החדר מתאים בקלות לקבוצה של בין 6-8 אנשים.
    אז אוהבים את השקט והפרטיות? זה המקום בשבילכם `.replace(/\.\s/g, ".\n");

    this.simulatorText = `לחובבי האנדרנלין והמרוצים -
     בחדר הזה תוכלו לחוות חווית מרוצים מדמה מציאות ברמה הגבוהה ביותר שתוכלו לדמיין,
    חדר הסימולטורים מכיל סאט אפ שלם ומערכת חדישה ומתקדמת שעוטפת אתכם ונותנת תחושה ואנדנרלין של מירוץ אמיתי על מסלול המרוצים,
    אז כמו שאומרים, היזהרו בסיבובים וכמובן, מקווים בישבילכם שאתם בכושר, כי אתם בהחלט עומדים להתעייף!`.replace(/\.\s/g, ".\n");

    this.vrText = `הדובדבן שבקצפת - מי לא אוהב להרגיש שהוא לרגע אחד יוצא מהעולם המציאותי ועובר אל העולם הוירטואלי?
    בחדר הזה תוכלו להרגיש את זה בכל המובנים, חדר המציאות הוירטואלית כולל בתוכו מערכות שלמות עם הליכונים וציוד מתקדם וטכנולוגי
    שיתן לכם הרגשה שקשה לתאר במילים, ועוד דבר קטן, במערכות שלנו אפשר לשחק האחד נגד השני במשחק יריות.`.replace(/\.\s/g, ".\n");  
  }
  showImagePopup: boolean = false;
  popupImageUrl: string = '';

  openImagePopup(imageUrl: string): void {
    this.popupImageUrl = imageUrl;
    this.showImagePopup = true;
  }

  closeImagePopup(): void {
    this.showImagePopup = false;
  }
}

