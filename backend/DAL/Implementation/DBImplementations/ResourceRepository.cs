using EvoPlay.DAL;
using EvoPlay.Entities;
using EvoPlay.Repository.Contract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EvoPlay.Repository.Implementation
{
    public class ResourceRepository : IResourceRepository
    {
        private readonly GameCenterContext _context;

        public ResourceRepository(GameCenterContext context)
        {
            _context = context;
        }

        public async Task<List<Resource>> GetResourcesByTypeAsync(int resourceTypeId)
        {
            return await _context.Resources
                .Where(r => r.ResourceTypeId == resourceTypeId && r.IsAvailable)
                .ToListAsync();
        }
    }
}
