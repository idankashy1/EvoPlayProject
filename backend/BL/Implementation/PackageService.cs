// BL/Implementation/PackageService.cs
using EvoPlay.BL.Contract;
using EvoPlay.DAL.Contract; // I assume you have a repository interface
using EvoPlay.Entities;
using System.Collections.Generic;

namespace EvoPlay.BL.Implementation
{
    public class PackageService : IPackageService
    {
        private readonly IPackageRepository _packageRepository;

        public PackageService(IPackageRepository packageRepository)
        {
            _packageRepository = packageRepository;
        }

        public IEnumerable<Package> GetAllPackages()
        {
            return _packageRepository.GetAllPackages();
        }

        public IEnumerable<Package> GetAvailablePackages(int numberOfPlayers, int duration)
        {
            return _packageRepository.GetAvailablePackages(numberOfPlayers, duration);
        }
    }
}
