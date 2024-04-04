import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PackageService } from './package.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentData = new BehaviorSubject<any>(null);

  constructor(private packageService: PackageService) {}

  storePaymentData(bookingDetails: any) {
    // Simply pass the booking details to the next subscriber
    this.paymentData.next(bookingDetails);
  }

  getPaymentData() {
    return this.paymentData.asObservable();
  }
}
