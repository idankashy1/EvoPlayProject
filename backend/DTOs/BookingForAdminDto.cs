namespace EvoPlay.DTOs
{
    public class BookingForAdminDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string RoomName { get; set; }
        public int NumberOfPlayers { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string PhoneNumber { get; set; }
        public int AvailableRewards { get; set; }
    }
}