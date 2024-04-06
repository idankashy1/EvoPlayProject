using EvoPlay.BL.Contract;
using EvoPlay.Entities;
using EvoPlay.Repository.Contract;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.BL.Implementation
{
    public class BookingBL : IBookingBL
    {
        private readonly IBookingRepository _bookingRepository;


        public BookingBL(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<Booking> GetBookingByIdAsync(int id)
        {
            return await _bookingRepository.GetBookingByIdAsync(id);
        }

        public async Task<IEnumerable<Booking>> GetAllBookingsAsync()
        {
            return await _bookingRepository.GetAllBookingsAsync();
        }

        public async Task CreateBookingAsync(Booking booking)
        {
            // Verify the room exists
            var room = await _bookingRepository.GetRoomByIdAsync(booking.RoomId);
            if (room == null)
            {
                throw new ArgumentException("Invalid Room ID.");
            }

            // Directly add the booking without checking for availability again
            await _bookingRepository.AddBookingAsync(booking);
        }

        public async Task UpdateBookingAsync(int id, Booking booking)
        {
            var existingBooking = await _bookingRepository.GetBookingByIdAsync(id);
            if (existingBooking == null)
            {
                throw new KeyNotFoundException("Booking not found.");
            }

            existingBooking.UserId = booking.UserId;
            existingBooking.RoomId = booking.RoomId;
            existingBooking.Date = booking.Date;
            existingBooking.StartTime = booking.StartTime;
            existingBooking.EndTime = booking.EndTime;
            existingBooking.NumberOfPlayers = booking.NumberOfPlayers;
            existingBooking.PackageId = booking.PackageId;

            await _bookingRepository.UpdateBookingAsync(existingBooking);
        }

        public async Task CancelBookingAsync(int id)
        {
            var booking = await _bookingRepository.GetBookingByIdAsync(id);
            if (booking == null)
            {
                throw new KeyNotFoundException("Booking not found.");
            }
            await _bookingRepository.DeleteBookingAsync(booking);
        }

        public async Task<(bool IsAvailable, int? RoomId)> CheckRoomAvailabilityAsync(CheckAvailabilityDto dto)
        {
            bool startTimeParsed = DateTimeOffset.TryParse(dto.StartTime, out DateTimeOffset startTimeOffset);
            bool endTimeParsed = DateTimeOffset.TryParse(dto.EndTime, out DateTimeOffset endTimeOffset);

            if (!startTimeParsed || !endTimeParsed)
            {
                throw new ArgumentException("Invalid StartTime or EndTime format.");
            }
            TimeSpan startTime = startTimeOffset.TimeOfDay;
            TimeSpan endTime = endTimeOffset.TimeOfDay;

            return await _bookingRepository.IsRoomAvailableAsync(dto.Date, startTime, endTime, dto.RoomType, dto.NumberOfPlayers);
        }
        public async Task<IEnumerable<Booking>> SearchBookingsByPhoneNumberAsync(string phoneNumber)
        {
            return await _bookingRepository.GetBookingsByUserPhoneNumberAsync(phoneNumber);
        }
    }
}

