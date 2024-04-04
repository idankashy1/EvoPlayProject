namespace EvoPlay.Entities
{
    public class RoomType
    {
        public int Id { get; set; }
        public string Name { get; set; } // PS5, PS5VIP, VR, Racing Simulation

        // Navigation property
        public virtual ICollection<Room> Rooms { get; set; } = new HashSet<Room>();
    }
}