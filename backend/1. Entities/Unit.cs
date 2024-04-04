namespace EvoPlay.Entities
{
    public class Unit
    {
        public int UnitId { get; set; }
        public int RoomId { get; set; } // Foreign key to Room
        public int UnitNumber { get; set; } // Identifier of the unit within the room
        public bool IsAvailable { get; set; }

        // Navigation property back to the Room
        public virtual Room Room { get; set; }
    }
}