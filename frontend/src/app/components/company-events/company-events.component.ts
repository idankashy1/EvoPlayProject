import { Component, OnInit  } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-company-events',
  templateUrl: './company-events.component.html',
  styleUrls: ['./company-events.component.scss']
})
export class CompanyEventsComponent {
  cols = 4; // default number of columns

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 600px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.cols = 1; // Use 1 column for screens smaller than 600px
      } else {
        this.cols = 4; // Use 4 columns for screens larger than 600px
      }
    });
  }
  
  events = [
    {
      title: 'אירועי חברה',
      description: 'מתכננים אירוע חברה? תנו לנו להוביל אתכם לערב שכולו אדרנלין, כיף ותחרותיות. מגוון חדרי גיימינג מציעים את הדרך המושלמת לחבר בין העובדים, לחזק את רוח הקבוצה וליצור זיכרונות שלא ישכחו.',
      imageSrc: 'assets/Company_Event.jpg'
    },
    {
      title: 'ימי הולדת',
      description: 'הפכו את יום ההולדת לאירוע מסעיר של פעילות ושמחה. בחרו מתוך מגוון חדרי המשחקים והאטרקציות שלנו לחגוג באופן שאף אחד לא ישכח.',
      imageSrc: 'assets/Birthday_Event.jpg'
    },
    {
      title: 'מסיבת רווקים/רווקות',
      description: 'מרגישים תחושת הרפתקה לפני היום הגדול? יום רווקים/רווקות הוא ההזדמנות שלכם לשחרר את כל המתחים באווירה שכולה כיף ואקשן.',
      imageSrc: 'assets/Bachelor_Party.jpg'
    },
    {
      title: 'אירוע פרטי אחר',
      description: 'בין אם זה ערב קוקטייל או טורניר גיימינג, אנו כאן להתאים את החוויה בדיוק לרצונות שלכם. אירועים מותאמים אישית עם דגש על דיוק והתחשבות בכל פרט.',
      imageSrc: 'assets/Private_Event.jpg'
    },
  ];
}

