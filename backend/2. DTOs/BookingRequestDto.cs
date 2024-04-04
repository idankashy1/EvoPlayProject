namespace EvoPlay._2._DTOs
{
    public class BookingRequestDto
    {
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public string Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int NumberOfPlayers { get; set; }
        public int PackageId { get; set; }
    }
}
