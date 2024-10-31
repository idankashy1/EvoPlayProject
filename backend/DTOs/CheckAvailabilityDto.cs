using System;
using System.Collections.Generic;

namespace EvoPlay.DTOs
{
    public class CheckAvailabilityDto
    {
        public int ResourceTypeId { get; set; } // מזהה סוג המשאב
        public int QuantityRequested { get; set; } // כמות המשאבים המבוקשת
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
