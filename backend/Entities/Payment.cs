using System;

namespace EvoPlay.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public int BookingGroupId { get; set; } // FK ל-BookingGroup
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime PaymentDate { get; set; }

        // קשרי גומלין
        public virtual BookingGroup BookingGroup { get; set; }
    }
}
