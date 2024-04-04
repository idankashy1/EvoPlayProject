using System.Collections.Generic;

namespace EvoPlay.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public int RoomTypeId { get; set; } // FK to RoomType
        public int TotalCapacity { get; set; }
        public int UnitCount { get; set; }

        // Navigation properties
        public virtual RoomType RoomType { get; set; }
        public virtual ICollection<Unit> Units { get; set; } = new HashSet<Unit>();
    }
}