namespace EvoPlay.Entities
{
    public class Resource
    {
        public int Id { get; set; }
        public string Name { get; set; } // שם המשאב (למשל, "PS5 Room 1", "Omni One Device 1")
        public int ResourceTypeId { get; set; } // FK ל-ResourceType
        public int Capacity { get; set; } // מספר אנשים מקסימלי
        public bool IsAvailable { get; set; }

        // קשרי גומלין
        public virtual ResourceType ResourceType { get; set; }
    }
}
