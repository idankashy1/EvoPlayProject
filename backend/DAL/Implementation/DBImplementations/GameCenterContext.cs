using EvoPlay.Entities;
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
        public DbSet<Resource> Resources { get; set; }
        public DbSet<ResourceType> ResourceTypes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Package> Packages { get; set; } // ודא שיש את ה-DbSet הזה

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // BookingGroup
            modelBuilder.Entity<BookingGroup>()
                .HasMany(bg => bg.Bookings)
                .WithOne(b => b.BookingGroup)
                .HasForeignKey(b => b.BookingGroupId);

            // BookingGroup-User relationship
            modelBuilder.Entity<BookingGroup>()
                .HasOne(bg => bg.User)
                .WithMany(u => u.BookingGroups)
                .HasForeignKey(bg => bg.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // BookingGroup-Package relationship
            modelBuilder.Entity<BookingGroup>()
                .HasOne(bg => bg.Package)
                .WithMany(p => p.BookingGroups)
                .HasForeignKey(bg => bg.PackageId)
                .OnDelete(DeleteBehavior.SetNull);

            // Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.BookingGroup)
                .WithMany(bg => bg.Bookings)
                .HasForeignKey(b => b.BookingGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Resource)
                .WithMany(r => r.Bookings)
                .HasForeignKey(b => b.ResourceId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resource
            modelBuilder.Entity<Resource>()
                .HasOne(r => r.ResourceType)
                .WithMany(rt => rt.Resources)
                .HasForeignKey(r => r.ResourceTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            // User
            modelBuilder.Entity<User>()
                .HasMany(u => u.BookingGroups)
                .WithOne(bg => bg.User)
                .HasForeignKey(bg => bg.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Package
            modelBuilder.Entity<Package>()
                .HasMany(p => p.BookingGroups)
                .WithOne(bg => bg.Package)
                .HasForeignKey(bg => bg.PackageId)
                .OnDelete(DeleteBehavior.SetNull);

            // ResourceType
            modelBuilder.Entity<ResourceType>()
                .HasMany(rt => rt.Resources)
                .WithOne(r => r.ResourceType)
                .HasForeignKey(r => r.ResourceTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            // BookingGroup
            modelBuilder.Entity<BookingGroup>()
                .HasMany(bg => bg.Bookings)
                .WithOne(b => b.BookingGroup)
                .HasForeignKey(b => b.BookingGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Resource)
                .WithMany(r => r.Bookings)
                .HasForeignKey(b => b.ResourceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
