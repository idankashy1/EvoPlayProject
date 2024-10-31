using EvoPlay.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.Repository.Contract
{
    public interface IBookingRepository
    {
        // ניהול BookingGroup
        Task<BookingGroup> GetBookingGroupByIdAsync(int id);
        Task<List<BookingGroup>> GetAllBookingGroupsAsync();
        Task AddBookingGroupAsync(BookingGroup bookingGroup);
        Task UpdateBookingGroupAsync(BookingGroup bookingGroup);
        Task DeleteBookingGroupAsync(BookingGroup bookingGroup);

        // ניהול Booking בודד אם נחוץ
        Task<Booking> GetBookingByIdAsync(int id);

        // בדיקת זמינות משאבים
        Task<List<int>> GetUnavailableResourcesAsync(List<int> resourceIds, DateTime startTime, DateTime endTime);
        Task<List<int>> GetUnavailableResourcesByTypeAsync(int resourceTypeId, DateTime startTime, DateTime endTime);


        // חיפוש קבוצות הזמנה לפי מספר טלפון
        Task<IEnumerable<BookingGroup>> GetBookingGroupsByUserPhoneNumberAsync(string phoneNumber);
        Task<IEnumerable<BookingGroup>> GetBookingGroupsByUserIdAsync(int userId);

    }
}
