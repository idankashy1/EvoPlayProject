namespace EvoPlay.DTOs
{
    public class UserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public int TotalPoints { get; set; }
        public int CurrentPoints { get; set; } // הוספנו את השדה
        public int AvailableRewards { get; set; }
        public string Role { get; set; } // הוספת השדה הזה

    }
}