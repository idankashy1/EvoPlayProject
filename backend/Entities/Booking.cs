using System;
using System.Collections.Generic;

namespace EvoPlay.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int BookingGroupId { get; set; } // FK ל-BookingGroup
        public int ResourceId { get; set; } // FK ל-Resource
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int NumberOfPlayers { get; set; }


        // קשרי גומלין
        public virtual BookingGroup BookingGroup { get; set; }
        public virtual Resource Resource { get; set; }
    }
}
