namespace EvoPlay.Entities
{
    public class Package
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string Description { get; set; } 
        public int MinimumTime { get; set; } 
        public int MinimumPeople { get; set; } 
        public string ImageUrl { get; set; } 

    }
}