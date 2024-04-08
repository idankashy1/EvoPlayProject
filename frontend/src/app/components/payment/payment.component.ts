import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { BookingService } from '../../services/booking.serivce'; // You need to create this service
import { CheckUserExistsResponse } from '../../models/check-user-exists-response.model';


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
      city: '',
      address: '',
    });
  }

  onPaymentSubmit(): void {
    if (this.userDetailsForm.valid) {
      const userDetails = this.extractUserDetails();
      this.bookingService.checkUserExists(userDetails.email).subscribe({
        next: (response: CheckUserExistsResponse) => {
          console.log('Response from checkUserExists:', response);
          if (response.exists) {
            console.log(`User exists, user ID: ${response.userId}`);
            // Ensure userId is defined before proceeding
            if (response.userId) {
              // Proceed with booking creation using the existing userId
              this.createBooking(response.userId);
            } else {
              console.error('UserId is undefined for an existing user.');
              // Handle the error scenario
            }
          } else {
            console.log('User does not exist, proceeding to create a new user.');
            // Proceed with user creation and then booking
            this.createUserAndProceedWithBooking(userDetails);
          }
        },
        error: (error) => {
          console.error('Error checking user existence:', error);
          // Handle the error
        }
      });
    } else {
      console.error('Form is invalid, please review and correct the details.');
    }
  }
  
  private extractUserDetails(): any {
    console.log('Extracting user details from form.');
    return {
      firstName: this.userDetailsForm.get('firstName')?.value || '',
      lastName: this.userDetailsForm.get('lastName')?.value || '',
      phoneNumber: this.userDetailsForm.get('phoneNumber')?.value || '',
      email: this.userDetailsForm.get('email')?.value || '',
      city: this.userDetailsForm.get('city')?.value || '',
      address: this.userDetailsForm.get('address')?.value || '',
    };
  }
  
  private createBooking(userId: string): void {
    const bookingDetails = this.prepareBookingDetails(userId);
    console.log('Creating booking with request:', bookingDetails);
    this.bookingService.createBooking(bookingDetails).subscribe({
      next: (bookingResponse) => {
        console.log('Booking successful, response:', bookingResponse);
        // Navigate to a confirmation page or show a success message
      },
      error: (error) => {
        console.error('Booking creation failed:', error);
        // Handle booking creation failure
      }
    });
  }
  
  private createUserAndProceedWithBooking(userDetails: any): void {
    console.log('Creating new user with details:', userDetails);
    this.bookingService.createUser(userDetails).subscribe({
      next: (userResponse) => {
        console.log('User creation successful, proceeding to create booking with new userId:', userResponse.id);
        this.createBooking(userResponse.id);
      },
      error: (error) => {
        console.error('User creation failed:', error);
        // Handle user creation failure
      }
    });
  }
  private prepareBookingDetails(userId: string): any {
    // Example booking details - adjust according to your actual data structure
    return {
      userId: userId, // Use the provided userId
      roomId: this.bookingDetails.roomId, // Assuming this is stored in bookingDetails
      date: this.bookingDetails.bookingDate, // Booking date
      startTime: this.bookingDetails.startHour, // Booking start time
      endTime: this.bookingDetails.endHour, // Booking end time
      numberOfPlayers: this.bookingDetails.numberOfPlayers, // Number of players/participants
      packageId: this.bookingDetails.selectedPackage.id, // Optional: package or service ID if applicable
    };
  }

}
