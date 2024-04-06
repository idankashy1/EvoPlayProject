using EvoPlay.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.BL.Contract
{
    public interface IBookingBL
    {
        Task<Booking> GetBookingByIdAsync(int id);
        Task<IEnumerable<Booking>> GetAllBookingsAsync();
        Task CreateBookingAsync(Booking booking);
        Task UpdateBookingAsync(int id, Booking booking);
        Task CancelBookingAsync(int id);
        Task<(bool IsAvailable, int? RoomId)> CheckRoomAvailabilityAsync(CheckAvailabilityDto dto);
        Task<IEnumerable<Booking>> SearchBookingsByPhoneNumberAsync(string phoneNumber);
    }
}
