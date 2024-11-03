import { Component, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../../services/booking.serivce';
import { Booking } from '../../models/booking.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  todaysBookings: Booking[] = [];
  displayedColumns: string[] = [
    'id', 
    'fullName', 
    'roomName', 
    'numberOfPlayers', 
    'startTime', 
    'endTime', 
    'phoneNumber', 
    'availableRewards'
  ];
  dataSource!: MatTableDataSource<Booking>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadTodaysBookings();
  }

  loadTodaysBookings(): void {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.bookingService.getTodaysBookings(today).subscribe({
      next: (bookings: Booking[]) => {
        this.todaysBookings = bookings;
        this.dataSource = new MatTableDataSource(this.todaysBookings);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Failed to load today\'s bookings', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
