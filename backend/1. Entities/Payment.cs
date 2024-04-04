﻿namespace EvoPlay.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } 
        public DateTime PaymentDate { get; set; }
    }
}