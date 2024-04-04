import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CompanyEventsComponent } from './components/company-events/company-events.component';
import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { OurRoomsComponent } from './components/our-rooms/our-rooms.component';
import { PackageSelectionComponent } from './components/package-selection/package-selection.component';
import { OurPackagesComponent } from './components/our-packages/our-packages.component';
import { TranslateRoomTypePipe } from './pipes/translate-room-type.pipe';
import { PaymentComponent } from './components/payment/payment.component';
import { MaterialModule } from './material.module';

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
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
