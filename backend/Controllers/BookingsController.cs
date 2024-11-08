using EvoPlay._2._DTOs;
using EvoPlay.BL.Contract;
using EvoPlay.DTOs;
using EvoPlay.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EvoPlay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingBL _bookingBL;
        private readonly IUserBL _userBL;

        public BookingsController(IBookingBL bookingBL, IUserBL userBL)
        {
            _bookingBL = bookingBL;
            _userBL = userBL;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDto bookingRequest)
        {
            int? userId = null;

            // בדיקת אם המשתמש מחובר
            if (User.Identity.IsAuthenticated)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim != null)
                {
                    userId = int.Parse(userIdClaim);
                }
            }

            // אם המשתמש מחובר, נשתמש ב-UserId שלו
            if (userId.HasValue)
            {
                bookingRequest.UserId = userId.Value;
            }

            try
            {
                // יצירת ההזמנה
                var bookingGroup = await _bookingBL.CreateBookingGroupAsync(bookingRequest);

                return Ok(new { message = "Booking created successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("group/{id}")]
        public async Task<ActionResult<BookingGroup>> GetBookingGroupById(int id)
        {
            var bookingGroup = await _bookingBL.GetBookingGroupByIdAsync(id);
            if (bookingGroup == null)
            {
                return NotFound();
            }
            return bookingGroup;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<BookingGroup>>> GetAllBookingGroups()
        {
            var bookingGroups = await _bookingBL.GetAllBookingGroupsAsync();
            return Ok(bookingGroups);
        }

        [HttpPut("group/{id}")]
        public async Task<IActionResult> UpdateBookingGroup(int id, [FromBody] BookingGroup updatedBookingGroup)
        {
            try
            {
                await _bookingBL.UpdateBookingGroupAsync(id, updatedBookingGroup);
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

        [HttpDelete("group/{id}")]
        public async Task<IActionResult> DeleteBookingGroup(int id)
        {
            try
            {
                await _bookingBL.CancelBookingGroupAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("check-availability")]
        public async Task<IActionResult> CheckAvailability([FromBody] CheckAvailabilityDto availabilityDto)
        {
            try
            {
                var isAvailable = await _bookingBL.CheckAvailabilityAsync(availabilityDto);
                return Ok(new { IsAvailable = isAvailable });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("today")]
        public async Task<IActionResult> GetTodaysBookings([FromQuery] string date)
        {
            if (!DateTime.TryParse(date, out DateTime parsedDate))
            {
                return BadRequest("Invalid date format.");
            }

            var bookings = await _bookingBL.GetTodaysBookingsAsync(parsedDate);
            return Ok(bookings);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("search")]
        public async Task<IActionResult> SearchBookings([FromQuery] string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return BadRequest("Search term is required.");
            }

            var bookings = await _bookingBL.SearchBookingsAsync(searchTerm);
            return Ok(bookings);
        }

        // Endpoint לקבלת הזמנות בטווח תאריכים
        [Authorize(Roles = "Admin")]
        [HttpGet("daterange")]
        public async Task<IActionResult> GetBookingsByDateRange([FromQuery] string from, [FromQuery] string to)
        {
            if (!DateTime.TryParse(from, out DateTime fromDate) || !DateTime.TryParse(to, out DateTime toDate))
            {
                return BadRequest("Invalid date range.");
            }

            var bookings = await _bookingBL.GetBookingsByDateRangeAsync(fromDate, toDate);
            return Ok(bookings);
        }
    }
}
