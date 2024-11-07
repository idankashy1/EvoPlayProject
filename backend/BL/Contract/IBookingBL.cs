using EvoPlay.DTOs;
using EvoPlay.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.BL.Contract
{
    public interface IBookingBL
    {
        // ניהול BookingGroup
        Task<BookingGroup> GetBookingGroupByIdAsync(int id);
        Task<IEnumerable<BookingGroup>> GetAllBookingGroupsAsync();
        Task<BookingGroup> CreateBookingGroupAsync(BookingRequestDto bookingRequest);
        Task UpdateBookingGroupAsync(int id, BookingGroup bookingGroup);
        Task CancelBookingGroupAsync(int id);

        // ניהול Booking בודד אם נחוץ
        Task<Booking> GetBookingByIdAsync(int id);
        Task<bool> CheckAvailabilityAsync(CheckAvailabilityDto availabilityDto);

        // בדיקת זמינות משאבים
        Task<List<int>> GetUnavailableResourcesAsync(List<int> resourceIds, DateTime startTime, DateTime endTime);

        // חיפוש הזמנות לפי מספר טלפון
        Task<IEnumerable<BookingGroup>> SearchBookingGroupsByPhoneNumberAsync(string phoneNumber);

        // הוספת פונקציה חדשה לקבלת הזמנות של היום
        Task<IEnumerable<BookingForAdminDto>> GetTodaysBookingsAsync(DateTime date);
        Task<IEnumerable<Booking>> SearchBookingsAsync(string searchTerm);
        Task<IEnumerable<BookingForAdminDto>> GetBookingsByDateRangeAsync(DateTime from, DateTime to);
    }
}
