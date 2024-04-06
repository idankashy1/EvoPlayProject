import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component'; // Make sure to create this component
import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { OurRoomsComponent } from './components/our-rooms/our-rooms.component';
import { PackageSelectionComponent } from './components/package-selection/package-selection.component';
import { OurPackagesComponent } from './components/our-packages/our-packages.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CompanyEventsComponent } from './components/company-events/company-events.component';
import { LoginComponent } from './components/login/login.component';
import { OrderSearchComponent } from './components/order-search/order-search.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'order-search', component: OrderSearchComponent },
  { path: 'our-rooms', component: OurRoomsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'package-selection', component: PackageSelectionComponent },
  { path: 'our-packages', component: OurPackagesComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'company-events', component: CompanyEventsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
