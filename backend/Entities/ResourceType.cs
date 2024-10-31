namespace EvoPlay.Entities
{
    public class ResourceType
    {
        public int Id { get; set; }
        public string Name { get; set; } // PS5 Room, PS5 VIP Room, VR Device, Gaming Computer וכו'

        // קשרי גומלין
        public virtual ICollection<Resource> Resources { get; set; } = new HashSet<Resource>();
    }
}
