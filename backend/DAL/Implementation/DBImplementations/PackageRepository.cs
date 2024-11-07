// Repo/Implementation/PackageRepository.cs
using EvoPlay.DAL.Contract;
using EvoPlay.Entities;
using System.Collections.Generic;
using System.Linq;

namespace EvoPlay.DAL.Implementation
{
    public class PackageRepository : IPackageRepository
    {
        private readonly GameCenterContext _context;

        public PackageRepository(GameCenterContext context)
        {
            _context = context;
        }
        public async Task<Package> GetPackageByIdAsync(int id)
        {
            return await _context.Packages.FindAsync(id);
        }

        public IEnumerable<Package> GetAllPackages()
        {
            return _context.Packages.ToList();
        }

        public IEnumerable<Package> GetAvailablePackages(int numberOfPlayers, int duration)
        {
            return _context.Packages
                .Where(p => p.MinimumPeople <= numberOfPlayers && p.MinimumTime <= duration)
                .ToList();
        }
    }
}
