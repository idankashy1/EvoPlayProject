using EvoPlay.DTOs;
using EvoPlay.Entities;

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

    }
}
