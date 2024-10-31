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

        public DbSet<ResourceType> ResourceTypes { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<BookingGroup> BookingGroups { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User ID auto-generated on add
            modelBuilder.Entity<User>()
                .Property(u => u.Id)
                .ValueGeneratedOnAdd();

            // ResourceType-Resource relationship
            modelBuilder.Entity<ResourceType>()
                .HasMany(rt => rt.Resources)
                .WithOne(r => r.ResourceType)
                .HasForeignKey(r => r.ResourceTypeId);

            // BookingGroup-Booking relationship
            modelBuilder.Entity<BookingGroup>()
                .HasMany(bg => bg.Bookings)
                .WithOne(b => b.BookingGroup)
                .HasForeignKey(b => b.BookingGroupId);

            // BookingGroup-User relationship
            modelBuilder.Entity<BookingGroup>()
                .HasOne(bg => bg.User)
                .WithMany()
                .HasForeignKey(bg => bg.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // BookingGroup-Package relationship
            modelBuilder.Entity<BookingGroup>()
                .HasOne(bg => bg.Package)
                .WithMany(p => p.BookingGroups)
                .HasForeignKey(bg => bg.PackageId)
                .OnDelete(DeleteBehavior.SetNull);

            // Booking-Resource relationship
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Resource)
                .WithMany()
                .HasForeignKey(b => b.ResourceId);

            // Payment-BookingGroup relationship
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.BookingGroup)
                .WithMany()
                .HasForeignKey(p => p.BookingGroupId);

            // Payment amount type configuration
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18, 2)");

            // הגדרות נוספות לפי הצורך
        }
    }
}
