import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Renderer2 } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('expanded', style({ height: '*', overflow: 'visible', opacity: 1 })),
      transition('collapsed <=> expanded', animate('600ms ease-in-out')),
    ]),
  ],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild(NgImageSliderComponent) ngImageSlider!: NgImageSliderComponent;


  counters = [
    { value: 150, label: 'משחקים' },
    { value: 24, label: 'קונסולות משחק' },
    { value: 12, label: 'חדרים' },
    { value: 5, label: 'מתחמים' },
  ];

  countUpOptions = {
    duration: 3,
    separator: ',',
  };

  slides = [
    {
      image: 'assets/gallery/PeoplePlayingFifa.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingFifa.jpg',
      alt: 'Gallery Image 1',
    },
    {
      image: 'assets/gallery/PeoplePlayingFifa2.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingFifa2.jpg',
      alt: 'Gallery Image 2',
    },
    {
      image: 'assets/gallery/PeoplePlayingFifa3.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingFifa3.jpg',
      alt: 'Gallery Image 3',
    },
    {
      image: 'assets/gallery/PeoplePlayingNba.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingNba.jpg',
      alt: 'Gallery Image 4',
    },
    {
      image: 'assets/gallery/PeopleWatchingTV.jpg',
      thumbImage: 'assets/gallery/PeopleWatchingTV.jpg',
      alt: 'Gallery Image 5',
    },
    {
      image: 'assets/gallery/PeopleWatchingTV2.jpg',
      thumbImage: 'assets/gallery/PeopleWatchingTV2.jpg',
      alt: 'Gallery Image 6',
    },
    {
      image: 'assets/gallery/PeopleWatchingTV3.jpg',
      thumbImage: 'assets/gallery/PeopleWatchingTV3.jpg',
      alt: 'Gallery Image 7',
    },
    {
      image: 'assets/gallery/PeoplePlayingPC.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingPC.jpg',
      alt: 'Gallery Image 8',
    },
    {
      image: 'assets/gallery/PeoplePlayingPC1.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingPC1.jpg',
      alt: 'Gallery Image 9',
    },
    {
      image: 'assets/gallery/PeoplePlayingVR1.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingVR1.jpg',
      alt: 'Gallery Image 10',
    },
    {
      image: 'assets/gallery/PeoplePlayingVR2.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingVR2.jpg',
      alt: 'Gallery Image 11',
    },
    {
      image: 'assets/gallery/PeoplePlayingVR3.jpg',
      thumbImage: 'assets/gallery/PeoplePlayingVR3.jpg',
      alt: 'Gallery Image 12',
    },
    {
      image: 'assets/gallery/PeopleWatchingTV.jpg',
      thumbImage: 'assets/gallery/PeopleWatchingTV.jpg',
      alt: 'Gallery Image 13',
    },
  ];

  reviews = [
    {
      name: 'יעל לוי',
      date: new Date('2024-10-01T14:30:00'),
      text: 'חוויה מדהימה! הצוות מקצועי והציוד ברמה הגבוהה ביותר.',
    },
    {
      name: 'דני כהן',
      date: new Date('2024-10-05T11:15:00'),
      text: 'המקום המושלם לאירועים וגיימינג עם חברים.',
    },
    {
      name: 'שרון מלכה',
      date: new Date('2024-10-10T16:45:00'),
      text: 'הילדים נהנו מכל רגע! בהחלט נחזור שוב.',
    },
    {
      name: 'מיכל אברג\'יל',
      date: new Date('2024-10-12T09:20:00'),
      text: 'המקום היה פשוט מדהים! לא יכולתי להאמין עד כמה ההשקעה בציוד ובחוויית המשחק היא גדולה. אנחנו נהנינו מכל רגע ובטוח שנחזור שוב עם כל החברים. תודה רבה לכל הצוות המדהים על חוויה בלתי נשכחת!',
    },
    {
      name: 'אורי גולן',
      date: new Date('2024-10-15T18:00:00'),
      text: 'חוויה שלא מהעולם הזה! כל כך נהניתי מהאווירה ומהמשחקים, המקום הזה באמת משהו מיוחד.',
    },
    {
      name: 'רונית ברקוביץ',
      date: new Date('2024-10-17T13:45:00'),
      text: 'מקום מומלץ בחום לכל מי שאוהב גיימינג ואווירה כיפית. השירות היה מעולה והילדים פשוט לא רצו לעזוב!',
    },
    {
      name: 'דוד פרידמן',
      date: new Date('2024-10-20T10:30:00'),
      text: 'הזמנתי את המקום לחגיגת יום ההולדת של הבן שלי, והילדים היו בעננים! אפילו אני התרגשתי לחזור ולהרגיש שוב כמו ילד. החדרים מאובזרים בצורה מושלמת וכל המשחקים היו מעודכנים וחדישים. זה בהחלט המקום לחגוג בו כל אירוע!',
    },
    {
      name: 'ליאת ישראלי',
      date: new Date('2024-10-25T15:15:00'),
      text: 'לא ציפיתי לכזו חוויה מטורפת! היה כיף בלתי רגיל עם החברים. המקום כל כך מושקע ומסודר, יש כאן מחשבה על כל פרט קטן. לא הפסקנו לשחק ולהתלהב מהטכנולוגיה המתקדמת.',
    },
    {
      name: 'אסף כהן',
      date: new Date('2024-10-28T19:00:00'),
      text: 'פשוט וואו! אם אתם מחפשים מקום לברוח אליו מהשגרה ולהנות כמו ילדים, זה המקום בשבילכם. הצוות עזר בכל שאלה, האווירה מדהימה והמשחקים פשוט בלתי רגילים.',
    },
    {
      name: 'מאיה רוזנברג',
      date: new Date('2024-10-30T11:40:00'),
      text: 'אחרי שחיפשנו מקום לבלות בו את היום עם החברים, מצאנו את המקום המושלם. החדרים, הטכנולוגיה, והצוות הנהדר עשו את כל החוויה לאחת הטובות שהיו לנו. בהחלט נחזור בקרוב!',
    },
  ];

  displayedReviews: any[] = [];
  reviewsToShow = 6; // מספר הביקורות הראשונות שמוצגות בהתחלה
  selectedReview: any = null;
  isExpanded = false;
  selectedSlide: any = null;


  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // מציגים את השורה הראשונה של הביקורות
    this.displayedReviews = this.reviews.slice(0, this.reviewsToShow);
  }

  ngAfterViewInit() {
    const video = this.myVideo.nativeElement;
    video.play().catch((error) => {
      video.muted = true;
      video.play().catch((err) =>
        console.error('Failed to restart video:', err)
      );
    });

    this.ngImageSlider.imageClick.subscribe(() => {
      setTimeout(() => {
        video.play().catch((err) =>
          console.error('Failed to play video:', err)
        );
      }, 0);

      this.renderer.setStyle(document.body, 'overflow', 'visible');
    });

    this.ngImageSlider.lightboxClose.subscribe(() => {
      this.renderer.removeStyle(document.body, 'overflow');
    });
  }

  loadMoreReviews() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      // מציגים את כל הביקורות
      this.displayedReviews = this.reviews;
    } else {
      // חוזרים להצגת השורה הראשונה בלבד
      this.displayedReviews = this.reviews.slice(0, this.reviewsToShow);
    }

    // גלילה חלקה אל הקונטיינר של הביקורות
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openReviewPopup(review: any) {
    this.selectedReview = review;
  }

  closeReviewPopup() {
    this.selectedReview = null;
  }

  openImageModal(slide: any) {
    this.selectedSlide = slide;
  }

  closeImageModal() {
    this.selectedSlide = null;
  }

  scrollToBookingForm() {
    const bookingFormElement = document.getElementById('booking-form');
    if (bookingFormElement) {
      bookingFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}