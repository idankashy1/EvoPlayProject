using System;

namespace EvoPlay.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Foreign key to User
        public int RoomId { get; set; } // Foreign key to Room
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; } // Replaces Duration
        public int NumberOfPlayers { get; set; }
        public int PackageId { get; set; } // Consider making nullable if not always applicable

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Room Room { get; set; }
    }
}
