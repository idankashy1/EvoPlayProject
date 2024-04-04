import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { BookingService } from '../../services/booking.serivce'; // You need to create this service

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  bookingDetails: any; // Placeholder, replace with your actual booking details model
  userDetailsForm!: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private bookingService: BookingService, // Add this service
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.paymentService.getPaymentData().subscribe(data => {
      this.bookingDetails = data;
      console.log('Booking and Package Data:', this.bookingDetails);
    });

    // Initialize the form
    this.userDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  onPaymentSubmit(): void {
    if (this.userDetailsForm.valid) {
      const userDetails = {
        firstName: this.userDetailsForm.get('firstName')?.value || '',
        lastName: this.userDetailsForm.get('lastName')?.value || '',
        phoneNumber: this.userDetailsForm.get('phoneNumber')?.value || '',
        email: this.userDetailsForm.get('email')?.value || '',
        city: this.userDetailsForm.get('city')?.value || '',
        address: this.userDetailsForm.get('address')?.value || '',
      };
  
      // Create a user and then proceed directly to booking creation.
      this.bookingService.createUser(userDetails).subscribe({
        next: (userResponse) => {
          const userId = userResponse.id; // Adjust based on your actual API
          
          // Use previously stored room details including roomId
          const roomId = this.bookingDetails.roomId; // Ensure roomId is stored in bookingDetails during the availability check
          const bookingDate = this.bookingDetails.bookingDate;
          const startHour = this.bookingDetails.startHour;
          const endHour = this.bookingDetails.endHour;
          const numberOfPlayers = this.bookingDetails.numberOfPlayers;
          const packageId = this.bookingDetails.selectedPackage.id; // Assuming package details are included
  
          // With userId and roomId, create the booking directly without checking availability again
          const bookingRequest = {
            userId,
            roomId,
            date: bookingDate,
            startTime: startHour,
            endTime: endHour,
            numberOfPlayers,
            packageId
          };
          console.log('Creating booking with request:', bookingRequest);
          this.bookingService.createBooking(bookingRequest).subscribe({
            next: (bookingResponse) => {
              console.log('Booking successful:', bookingResponse);
              // Navigate to confirmation page or show success message
            },
            error: (error) => {
              console.error('Booking failed:', error);
              // Handle booking creation failure
            }
          });
        },
        error: (error) => {
          console.error('User creation failed:', error);
          // Handle user creation failure
        }
      });
    } else {
      console.error('Form is invalid');
      // Handle form validation feedback to user
    }
  }
}
