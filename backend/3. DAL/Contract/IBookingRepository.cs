using EvoPlay.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.Repository.Contract
{
    public interface IBookingRepository
    {
        Task<Booking> GetBookingByIdAsync(int id);
        Task<List<Booking>> GetAllBookingsAsync();
        Task<List<Booking>> GetBookingsByCriteriaAsync(Func<Booking, bool> predicate);
        Task AddBookingAsync(Booking booking);
        Task UpdateBookingAsync(Booking booking);
        Task DeleteBookingAsync(Booking booking);
        Task<(bool IsAvailable, int? RoomId)> IsRoomAvailableAsync(DateTime date, TimeSpan startTime, TimeSpan endTime, string roomTypeName, int numberOfPlayers);
        Task<Room> GetRoomByIdAsync(int roomId);
        Task<IEnumerable<Booking>> GetBookingsByUserPhoneNumberAsync(string phoneNumber);
    }
}