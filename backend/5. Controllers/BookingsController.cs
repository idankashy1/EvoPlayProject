using Microsoft.AspNetCore.Mvc;
using EvoPlay.BL.Contract;
using EvoPlay.Entities;
using EvoPlay._2._DTOs; 
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;

namespace EvoPlay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingBL _bookingBL;

        public BookingsController(IBookingBL bookingBL)
        {
            _bookingBL = bookingBL;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDto bookingRequest)
        {
            try
            {
                // Convert string dates and times to DateTime and TimeSpan
                if (!DateTime.TryParse(bookingRequest.Date, out DateTime date) ||
                    !TimeSpan.TryParse(bookingRequest.StartTime, out TimeSpan startTime) ||
                    !TimeSpan.TryParse(bookingRequest.EndTime, out TimeSpan endTime))
                {
                    return BadRequest("Invalid date or time format.");
                }

                Booking booking = new Booking()
                {
                    UserId = bookingRequest.UserId,
                    RoomId = bookingRequest.RoomId,
                    Date = date,
                    StartTime = startTime,
                    EndTime = endTime,
                    NumberOfPlayers = bookingRequest.NumberOfPlayers,
                    PackageId = bookingRequest.PackageId
                };

                await _bookingBL.CreateBookingAsync(booking);
                return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBookingById(int id)
        {
            var booking = await _bookingBL.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return booking;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            var bookings = await _bookingBL.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] Booking booking)
        {
            try
            {
                await _bookingBL.UpdateBookingAsync(id, booking);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            try
            {
                await _bookingBL.CancelBookingAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // Adjusted to handle POST request
        [HttpPost("check-availability")]
        public async Task<IActionResult> CheckRoomAvailability([FromBody] CheckAvailabilityDto dto)
        {
            var (isAvailable, roomId) = await _bookingBL.CheckRoomAvailabilityAsync(dto);

            if (!isAvailable)
            {
                return BadRequest("The requested room is not available for the specified date and time.");
            }

            return Ok(new { Message = "Room is available", IsAvailable = isAvailable, RoomId = roomId });
        }
        [HttpGet("search/by-phone")]
        public async Task<IActionResult> SearchBookingsByPhoneNumber(string phoneNumber)
        {
            var bookings = await _bookingBL.SearchBookingsByPhoneNumberAsync(phoneNumber);
            return Ok(bookings); // Or handle empty results as you see fit
        }
    }
}
