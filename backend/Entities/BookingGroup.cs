using EvoPlay.Entities;

public class BookingGroup
{
    public int Id { get; set; }
    public int UserId { get; set; } // FK ל-User
    public int? PackageId { get; set; } // FK ל-Package, ניתן להיות null
    public DateTime Date { get; set; }

    // קשרי גומלין
    public virtual User User { get; set; }
    public virtual Package Package { get; set; }
    public virtual ICollection<Booking> Bookings { get; set; } = new HashSet<Booking>();
}
