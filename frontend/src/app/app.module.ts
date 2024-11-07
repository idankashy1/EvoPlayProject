// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// קומפוננטות
import { HeaderComponent } from './components/header/header.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CompanyEventsComponent } from './components/company-events/company-events.component';
import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { FooterComponent } from './components/footer/footer.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { OurRoomsComponent } from './components/our-rooms/our-rooms.component';
import { PackageSelectionComponent } from './components/package-selection/package-selection.component';
import { OurPackagesComponent } from './components/our-packages/our-packages.component';
import { TranslateRoomTypePipe } from './pipes/translate-room-type.pipe';
import { PaymentComponent } from './components/payment/payment.component';
import { LoginComponent } from './components/login/login.component';
import { OrderSearchComponent } from './components/order-search/order-search.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RegisterComponent } from './components/register/register.component';
import { RewardsInfoDialogComponent } from './components/rewards-info-dialog/rewards-info-dialog.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

// מודולים של Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module'; // ודא שהנתיב נכון

// Guard
import { AdminGuard } from './guards/admin.guard';

// טפסים
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// HttpClient
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutUsComponent,
    CompanyEventsComponent,
    HomeComponent,
    ContactUsComponent,
    FooterComponent,
    BookingFormComponent,
    OurRoomsComponent,
    PackageSelectionComponent,
    OurPackagesComponent,
    TranslateRoomTypePipe,
    PaymentComponent,
    LoginComponent,
    OrderSearchComponent,
    UserProfileComponent,
    RegisterComponent,
    RewardsInfoDialogComponent,
    AdminDashboardComponent,
    InfoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule, // כולל MatTableModule
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    AdminGuard,
    // ספקים נוספים אם יש...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
