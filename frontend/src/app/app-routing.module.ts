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
  { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'order-search', component: OrderSearchComponent, data: { animation: 'OrderSearchPage' } },
  { path: 'our-rooms', component: OurRoomsComponent, data: { animation: 'RoomsPage' } },
  { path: 'about-us', component: AboutUsComponent, data: { animation: 'AboutPage' } },
  { path: 'contact-us', component: ContactUsComponent, data: { animation: 'ContactPage' } },
  { path: 'package-selection', component: PackageSelectionComponent, data: { animation: 'PackagePage' } },
  { path: 'our-packages', component: OurPackagesComponent, data: { animation: 'PackagesPage' } },
  { path: 'payment', component: PaymentComponent, data: { animation: 'PaymentPage' } },
  { path: 'company-events', component: CompanyEventsComponent, data: { animation: 'EventsPage' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
