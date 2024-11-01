using EvoPlay.DTOs;
using EvoPlay.BL.Contract;
using EvoPlay.Entities;
using EvoPlay.Repository.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EvoPlay.BL.Implementation
{
    public class BookingBL : IBookingBL
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IUserRepository _userRepository;
        private readonly IResourceRepository _resourceRepository;

        public BookingBL(IBookingRepository bookingRepository, IUserRepository userRepository, IResourceRepository resourceRepository)
        {
            _bookingRepository = bookingRepository;
            _userRepository = userRepository;
            _resourceRepository = resourceRepository;
        }

        // פונקציה ליצירת קבוצת הזמנה חדשה
        public async Task<BookingGroup> CreateBookingGroupAsync(BookingRequestDto bookingRequest)
        {
            // בדיקה אם המשתמש קיים לפי דוא"ל
            var user = await _userRepository.GetUserByEmailAsync(bookingRequest.Email);
            if (user == null)
            {
                // יצירת משתמש חדש
                user = new User
                {
                    FirstName = bookingRequest.FirstName,
                    LastName = bookingRequest.LastName,
                    PhoneNumber = bookingRequest.PhoneNumber,
                    Email = bookingRequest.Email,
                    City = bookingRequest.City,
                    Address = bookingRequest.Address
                    // PasswordHash נשאר null
                };
                await _userRepository.AddUserAsync(user);
            }

            // קבלת המשאבים הזמינים
            var availableResources = await GetAvailableResourcesAsync(bookingRequest.ResourceTypeId, bookingRequest.Quantity, bookingRequest.StartTime, bookingRequest.EndTime);

            if (bookingRequest.ResourceTypeId == 1 || bookingRequest.ResourceTypeId == 2)
            {
                // חדרי Sony ו-Sony VIP
                // צריכים חדר אחד
                if (availableResources.Count < 1)
                {
                    throw new Exception("No available rooms for the requested time.");
                }

                // משתמשים בחדר אחד
                availableResources = availableResources.Take(1).ToList();
            }
            else if (bookingRequest.ResourceTypeId == 3 || bookingRequest.ResourceTypeId == 4)
            {
                // חדרי PC ו-VR
                // צריכים את כמות המשאבים המבוקשת
                if (availableResources.Count < bookingRequest.Quantity)
                {
                    throw new Exception("Not enough resources available for the requested time.");
                }

                availableResources = availableResources.Take(bookingRequest.Quantity).ToList();
            }
            else
            {
                throw new Exception("Unknown resource type.");
            }

            // יצירת BookingGroup
            var bookingGroup = new BookingGroup
            {
                UserId = user.Id,
                PackageId = bookingRequest.PackageId,
                Date = bookingRequest.StartTime.Date,
                Bookings = new List<Booking>()
            };

            // יצירת הזמנות עבור המשאבים הזמינים
            foreach (var resource in availableResources)
            {
                var booking = new Booking
                {
                    ResourceId = resource.Id,
                    StartTime = bookingRequest.StartTime,
                    EndTime = bookingRequest.EndTime
                };
                bookingGroup.Bookings.Add(booking);
            }

            // שמירת BookingGroup
            await _bookingRepository.AddBookingGroupAsync(bookingGroup);

            await UpdateUserPointsAsync(bookingGroup);

            return bookingGroup;
        }

        // פונקציה לקבלת הזמנה בודדת לפי מזהה
        public async Task<Booking> GetBookingByIdAsync(int id)
        {
            return await _bookingRepository.GetBookingByIdAsync(id);
        }

        // פונקציה לקבלת רשימת מזהי משאבים שאינם זמינים
        public async Task<List<int>> GetUnavailableResourcesAsync(List<int> resourceIds, DateTime startTime, DateTime endTime)
        {
            return await _bookingRepository.GetUnavailableResourcesAsync(resourceIds, startTime, endTime);
        }

        // פונקציה לחיפוש קבוצות הזמנה לפי מספר טלפון
        public async Task<IEnumerable<BookingGroup>> SearchBookingGroupsByPhoneNumberAsync(string phoneNumber)
        {
            var user = await _userRepository.GetUserByPhoneNumberAsync(phoneNumber);
            if (user == null)
            {
                return Enumerable.Empty<BookingGroup>();
            }

            return await _bookingRepository.GetBookingGroupsByUserIdAsync(user.Id);
        }

        // פונקציה לקבלת קבוצת הזמנה לפי מזהה
        public async Task<BookingGroup> GetBookingGroupByIdAsync(int id)
        {
            return await _bookingRepository.GetBookingGroupByIdAsync(id);
        }

        // פונקציה לקבלת כל קבוצות ההזמנה
        public async Task<IEnumerable<BookingGroup>> GetAllBookingGroupsAsync()
        {
            return await _bookingRepository.GetAllBookingGroupsAsync();
        }

        // פונקציה לעדכון קבוצת הזמנה
        public async Task UpdateBookingGroupAsync(int id, BookingGroup bookingGroup)
        {
            var existingBookingGroup = await _bookingRepository.GetBookingGroupByIdAsync(id);
            if (existingBookingGroup == null)
            {
                throw new KeyNotFoundException("BookingGroup not found.");
            }

            // עדכון הפרטים הנדרשים
            existingBookingGroup.PackageId = bookingGroup.PackageId;
            existingBookingGroup.Date = bookingGroup.Date;
            // עדכון רשימת ההזמנות אם נחוץ

            await _bookingRepository.UpdateBookingGroupAsync(existingBookingGroup);
        }

        // פונקציה לביטול קבוצת הזמנה
        public async Task CancelBookingGroupAsync(int id)
        {
            var bookingGroup = await _bookingRepository.GetBookingGroupByIdAsync(id);
            if (bookingGroup == null)
            {
                throw new KeyNotFoundException("BookingGroup not found.");
            }
            await _bookingRepository.DeleteBookingGroupAsync(bookingGroup);
        }

        // פונקציה לקבלת משאבים זמינים
        public async Task<List<Resource>> GetAvailableResourcesAsync(int resourceTypeId, int quantity, DateTime startTime, DateTime endTime)
        {
            // קבלת כל המשאבים מהסוג המבוקש
            var resources = await _resourceRepository.GetResourcesByTypeAsync(resourceTypeId);

            // קבלת רשימת ה-Ids של המשאבים
            var resourceIds = resources.Select(r => r.Id).ToList();

            // קבלת המשאבים הלא זמינים בטווח הזמן המבוקש
            var unavailableResourceIds = await _bookingRepository.GetUnavailableResourcesAsync(resourceIds, startTime, endTime);

            // המשאבים הזמינים
            var availableResources = resources.Where(r => !unavailableResourceIds.Contains(r.Id)).ToList();

            // החזרת המשאבים הזמינים הדרושים
            return availableResources.Take(quantity).ToList();
        }

        // פונקציה לבדיקת זמינות
        public async Task<bool> CheckAvailabilityAsync(CheckAvailabilityDto availabilityDto)
        {
            // קבלת כל המשאבים מהסוג המבוקש
            var resources = await _resourceRepository.GetResourcesByTypeAsync(availabilityDto.ResourceTypeId);

            // קבלת רשימת ה-Ids של המשאבים
            var resourceIds = resources.Select(r => r.Id).ToList();

            // קבלת המשאבים הלא זמינים בטווח הזמן המבוקש
            var unavailableResourceIds = await _bookingRepository.GetUnavailableResourcesAsync(resourceIds, availabilityDto.StartTime, availabilityDto.EndTime);

            // המשאבים הזמינים
            var availableResourceIds = resourceIds.Except(unavailableResourceIds).ToList();

            // כמות המשאבים הזמינים
            var availableResourcesCount = availableResourceIds.Count;

            // לוגיקה בהתאם לסוג המשאב
            if (availabilityDto.ResourceTypeId == 1 || availabilityDto.ResourceTypeId == 2)
            {
                // חדרי Sony ו-Sony VIP
                // צריכים חדר אחד פנוי
                return availableResourcesCount >= 1;
            }
            else if (availabilityDto.ResourceTypeId == 3 || availabilityDto.ResourceTypeId == 4)
            {
                // חדרי PC ו-VR
                // צריכים מספיק מכשירים זמינים
                return availableResourcesCount >= availabilityDto.QuantityRequested;
            }
            else
            {
                // סוג משאב לא מוכר
                throw new Exception("Unknown resource type.");
            }
        }
        private async Task UpdateUserPointsAsync(BookingGroup bookingGroup)
        {
            var user = await _userRepository.GetUserByIdAsync(bookingGroup.UserId);
            if (user != null)
            {
                // חישוב סך כל השעות בהזמנה זו
                double totalHours = bookingGroup.Bookings.Sum(b => (b.EndTime - b.StartTime).TotalHours);

                // חישוב מספר הנקודות שנצברו בהזמנה זו
                int pointsEarned = (int)(totalHours / 2);

                // עדכון סך הנקודות
                user.TotalPoints += pointsEarned;

                // בדיקה אם המשתמש זכאי להטבות חדשות
                while (user.TotalPoints >= 5)
                {
                    user.TotalPoints -= 5;
                    user.AvailableRewards += 1;
                }

                // שמירת השינויים
                await _userRepository.UpdateUserAsync(user);
            }
        }

    }
}
