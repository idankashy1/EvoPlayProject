using EvoPlay.DAL;
using EvoPlay.Entities;
using EvoPlay.Repository.Contract;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EvoPlay.Repository.Implementation
{
    public class BookingRepository : IBookingRepository
    {
        private readonly GameCenterContext _context;
        private readonly ILogger<BookingRepository> _logger;


        public BookingRepository(GameCenterContext context, ILogger<BookingRepository> logger)
        {
            _context = context;
            _logger = logger;

        }

        public async Task<Booking> GetBookingByIdAsync(int id)
        {
            return await _context.Bookings.FindAsync(id);
        }

        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            return await _context.Bookings.ToListAsync();
        }

        public async Task<List<Booking>> GetBookingsByCriteriaAsync(Func<Booking, bool> predicate)
        {
            // ToListAsync can only be called on IQueryable, so AsQueryable is used to convert IEnumerable to IQueryable
            return await _context.Bookings.Where(predicate).AsQueryable().ToListAsync();
        }

        public async Task AddBookingAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBookingAsync(Booking booking)
        {
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBookingAsync(Booking booking)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
        }
        public async Task<(bool IsAvailable, int? RoomId)> IsRoomAvailableAsync(DateTime date, TimeSpan startTime, TimeSpan endTime, string roomTypeName, int numberOfPlayers)
        {
            _logger.LogInformation($"Checking availability for: Date = {date}, StartTime = {startTime}, EndTime = {endTime}, RoomType = {roomTypeName}, NumberOfPlayers = {numberOfPlayers}");

            var startDateTime = date.Date + startTime;
            var endDateTime = date.Date + endTime;

            var potentialRooms = await _context.Rooms
                .Include(r => r.RoomType)
                .Where(r => r.RoomType.Name == roomTypeName && r.TotalCapacity >= numberOfPlayers)
                .ToListAsync();

            var bookedRoomIds = await _context.Bookings
                .Where(b => b.Date.Date == date.Date &&
                            ((b.StartTime < endTime && b.EndTime > startTime) ||
                             (b.EndTime > startTime && b.StartTime < endTime)))
                .Select(b => b.RoomId)
                .Distinct()
                .ToListAsync();

            _logger.LogInformation($"Potential room IDs: {string.Join(", ", potentialRooms.Select(r => r.Id))}");
            _logger.LogInformation($"Booked room IDs for the slot: {string.Join(", ", bookedRoomIds)}");

            var availableRoom = potentialRooms.FirstOrDefault(r => !bookedRoomIds.Contains(r.Id));

            if (availableRoom != null)
            {
                _logger.LogInformation($"Room {availableRoom.Id} is available for booking.");
            }
            else
            {
                _logger.LogWarning("No available rooms found for the specified criteria.");
            }

            return (availableRoom != null, availableRoom?.Id);
        }

        public async Task<Room> GetRoomByIdAsync(int roomId)
        {
            return await _context.Rooms.FindAsync(roomId);
        }
        public async Task<IEnumerable<Booking>> GetBookingsByUserPhoneNumberAsync(string phoneNumber)
        {
            return await _context.Bookings
                .Include(b => b.User) // Ensure you have a navigation property from Booking to User
                .Where(b => b.User.PhoneNumber == phoneNumber)
                .ToListAsync();
        }
    }
}
