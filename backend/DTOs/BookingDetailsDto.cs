namespace EvoPlay.Dtos
{
    public class BookingDetailsDto
    {
        public int NumberOfPlayers { get; set; }
        public int Duration { get; set; } // בדקות או שעות
        public List<int> ResourceIds { get; set; } // רשימת מזהי משאבים
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
