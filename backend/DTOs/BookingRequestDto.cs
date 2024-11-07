using System;
using System.Collections.Generic;

namespace EvoPlay.DTOs
{
    public class BookingRequestDto
    {
        // פרטי משתמש
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Address { get; set; }

        // פרטי הזמנה
        public int ResourceTypeId { get; set; } // מזהה סוג המשאב (למשל, PlayStation Room Regular)
        public int Quantity { get; set; } // כמות המשאבים המבוקשת (למשל, מספר מחשבים)
        public DateTime StartTime { get; set; } // כולל תאריך ושעה
        public DateTime EndTime { get; set; }
        public int NumberOfPlayers { get; set; }
        public int? PackageId { get; set; } // יכול להיות null
        public int? UserId { get; set; } // אופציונלי

    }
}
