// order-search.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order-search',
  templateUrl: './order-search.component.html',
  styleUrls: ['./order-search.component.scss']
})
export class OrderSearchComponent {
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      bookingByUsername: '',
      bookingByPhone: '',
      bookingByDate: ''
    });
  }

  onSubmit() {
    console.log('Searching with criteria:', this.searchForm.value);
    // Call a service method to perform the search
  }
}