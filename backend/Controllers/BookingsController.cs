using EvoPlay._2._DTOs;
using EvoPlay.BL.Contract;
using EvoPlay.DTOs;
using EvoPlay.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

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

        [HttpPost("create-booking")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDto bookingRequest)
        {
            try
            {
                var bookingGroup = await _bookingBL.CreateBookingGroupAsync(bookingRequest);
                return CreatedAtAction(nameof(GetBookingGroupById), new { id = bookingGroup.Id }, bookingGroup);
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
        // הוספת נקודת הקצה לבדיקת זמינות
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
    }
}
