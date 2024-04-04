using Microsoft.EntityFrameworkCore;
using EvoPlay.Entities;

namespace EvoPlay.DAL
{
    public class GameCenterContext : DbContext
    {
        public GameCenterContext(DbContextOptions<GameCenterContext> options)
            : base(options)
        {
        }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; } // Add this line

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User ID auto-generated on add
            modelBuilder.Entity<User>()
                .Property(u => u.Id)
                .ValueGeneratedOnAdd();

            // RoomType-Room relationship
            modelBuilder.Entity<RoomType>()
                .HasMany(rt => rt.Rooms)
                .WithOne(r => r.RoomType)
                .HasForeignKey(r => r.RoomTypeId);

            // Room-Unit relationship
            modelBuilder.Entity<Room>()
                .HasMany(r => r.Units)
                .WithOne(u => u.Room)
                .HasForeignKey(u => u.RoomId);

            // Booking-User relationship
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Booking-Room relationship
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Room)
                .WithMany()
                .HasForeignKey(b => b.RoomId);

            // Payment amount type configuration
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18, 2)");

            // Configure any additional relationships and model configurations as needed
            // No need to seed data here as you're handling it through SSMS
        }
    }
}
