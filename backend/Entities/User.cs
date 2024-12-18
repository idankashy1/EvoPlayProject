﻿using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;


namespace EvoPlay.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string Email { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string? PasswordHash { get; set; } // Nullable

        public int TotalPoints { get; set; } = 0; // סך כל הנקודות שנצברו

        public int CurrentPoints { get; set; } = 0; // נקודות נוכחיות (מ-0 עד 9)

        public int AvailableRewards { get; set; } = 0; // מספר ההטבות הזמינות

        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
        public string Role { get; set; } = "User"; // ערך ברירת מחדל הוא 'User'
        public ICollection<BookingGroup> BookingGroups { get; set; }

    }
}
