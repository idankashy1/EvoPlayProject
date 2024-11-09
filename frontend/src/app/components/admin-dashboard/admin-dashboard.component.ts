// src/app/components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../../services/booking.serivce';
import { Booking } from '../../models/booking.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DateAdapter } from '@angular/material/core'; // ייבוא DateAdapter

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'fullName',
    'roomName',
    'numberOfPlayers',
    'date',
    'startTime',
    'endTime',
    'phoneNumber',
    'availableRewards',
  ];
  dataSource = new MatTableDataSource<Booking>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchControl = new FormControl<string>('', { nonNullable: true });
  fromDate = new FormControl<Date | null>(null);
  toDate = new FormControl<Date | null>(null);

  constructor(
    private bookingService: BookingService,
    private dateAdapter: DateAdapter<Date> // הוספת DateAdapter לקונסטרקטור
  ) {
    this.dateAdapter.setLocale('en-GB'); // הגדרת הלוקאל לפורמט dd/MM/yyyy
  }

  ngOnInit(): void {
    this.loadTodaysBookings();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.applyFilter(searchTerm || '');
      });
  }

  loadTodaysBookings(): void {
    const today = new Date().toISOString().split('T')[0];
    this.bookingService.getBookingsByDateRange(new Date(today), new Date(today)).subscribe({
      next: (bookings: Booking[]) => {
        this.dataSource.data = bookings;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error: any) => {
        console.error("Failed to load today's bookings", error);
      },
    });
  }

  applyFilter(filterValue: string): void {
    const normalizedFilter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Booking, filter: string) => {
      return (
        data.id.toString().includes(filter) ||
        `${data.firstName} ${data.lastName}`.toLowerCase().includes(filter) ||
        data.phoneNumber.includes(filter)
      );
    };
    this.dataSource.filter = normalizedFilter;
  }

  applyDateFilter(): void {
    const from = this.fromDate.value;
    const to = this.toDate.value;

    if (!from || !to) {
      this.loadTodaysBookings();
      return;
    }

    this.bookingService.getBookingsByDateRange(from, to).subscribe({
      next: (bookings: Booking[]) => {
        this.dataSource.data = bookings;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error: any) => {
        console.error('Failed to load bookings by date range', error);
      },
    });
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.fromDate.setValue(null);
    this.toDate.setValue(null);
    this.loadTodaysBookings();
  }
}
