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

        // ניהול BookingGroup
        public async Task<BookingGroup> GetBookingGroupByIdAsync(int id)
        {
            return await _context.BookingGroups
                .Include(bg => bg.Bookings)
                    .ThenInclude(b => b.Resource)
                .Include(bg => bg.User)
                .Include(bg => bg.Package) // הוספת Package
                .FirstOrDefaultAsync(bg => bg.Id == id);
        }

        public async Task<List<BookingGroup>> GetAllBookingGroupsAsync()
        {
            return await _context.BookingGroups
                .Include(bg => bg.Bookings)
                    .ThenInclude(b => b.Resource)
                .Include(bg => bg.User)
                .Include(bg => bg.Package) // הוספת Package
                .ToListAsync();
        }

        public async Task AddBookingGroupAsync(BookingGroup bookingGroup)
        {
            await _context.BookingGroups.AddAsync(bookingGroup);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBookingGroupAsync(BookingGroup bookingGroup)
        {
            _context.BookingGroups.Update(bookingGroup);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBookingGroupAsync(BookingGroup bookingGroup)
        {
            _context.BookingGroups.Remove(bookingGroup);
            await _context.SaveChangesAsync();
        }

        // ניהול Booking בודד אם נחוץ
        public async Task<Booking> GetBookingByIdAsync(int id)
        {
            return await _context.Bookings
                .Include(b => b.Resource)
                .Include(b => b.BookingGroup)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        // בדיקת זמינות משאבים
        public async Task<List<int>> GetUnavailableResourcesAsync(List<int> resourceIds, DateTime startTime, DateTime endTime)
        {
            var overlappingBookings = await _context.Bookings
                .Where(b => resourceIds.Contains(b.ResourceId) &&
                            ((b.StartTime < endTime && b.EndTime > startTime)))
                .Select(b => b.ResourceId)
                .Distinct()
                .ToListAsync();

            return overlappingBookings;
        }

        // חיפוש קבוצות הזמנה לפי מספר טלפון
        public async Task<IEnumerable<BookingGroup>> GetBookingGroupsByUserPhoneNumberAsync(string phoneNumber)
        {
            return await _context.BookingGroups
                .Include(bg => bg.Bookings)
                    .ThenInclude(b => b.Resource)
                .Include(bg => bg.User)
                .Include(bg => bg.Package) // הוספת Package
                .Where(bg => bg.User.PhoneNumber == phoneNumber)
                .ToListAsync();
        }

        public async Task<IEnumerable<BookingGroup>> GetBookingGroupsByUserIdAsync(int userId)
        {
            return await _context.BookingGroups
                .Include(bg => bg.Bookings)
                    .ThenInclude(b => b.Resource)
                .Include(bg => bg.User)
                .Include(bg => bg.Package) // הוספת Package
                .Where(bg => bg.UserId == userId)
                .ToListAsync();
        }

        // מימוש הפונקציה לקבלת המשאבים הלא זמינים מסוג מסוים
        public async Task<List<int>> GetUnavailableResourcesByTypeAsync(int resourceTypeId, DateTime startTime, DateTime endTime)
        {
            // קבלת כל המשאבים מהסוג המבוקש
            var resourceIds = await _context.Resources
                .Where(r => r.ResourceTypeId == resourceTypeId)
                .Select(r => r.Id)
                .ToListAsync();

            // קבלת המשאבים הלא זמינים
            var unavailableResourceIds = await GetUnavailableResourcesAsync(resourceIds, startTime, endTime);

            return unavailableResourceIds;
        }

        // מימוש פונקציה חדשה לקבלת הזמנות של היום
        public async Task<IEnumerable<Booking>> GetTodaysBookingsAsync(DateTime date)
        {
            return await _context.Bookings
                .Include(b => b.BookingGroup)
                    .ThenInclude(bg => bg.User)
                .Include(b => b.BookingGroup)
                    .ThenInclude(bg => bg.Package) // הוספת Package
                .Include(b => b.Resource)
                .Where(b => b.StartTime.Date == date.Date)
                .ToListAsync();
        }
    }
}
