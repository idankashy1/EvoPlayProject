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
            // תחילה מקבלים את כל החבילות הזכאיות מהריפו
            var eligiblePackages = _packageRepository.GetAvailablePackages(numberOfPlayers, duration);

            if (!eligiblePackages.Any())
            {
                return new List<Package>();
            }

            // מוצאים את הערך הגבוה ביותר של MinimumTime בין החבילות הזמינות
            var maxMinimumTime = eligiblePackages.Max(p => p.MinimumTime);

            // מסננים רק את החבילות עם ה-MinimumTime הגבוה ביותר
            var packagesWithMaxTime = eligiblePackages
                .Where(p => p.MinimumTime == maxMinimumTime);

            // בתוך החבילות עם ה-MinimumTime הגבוה ביותר, מוצאים את ה-MinimumPeople הגבוה ביותר
            var maxMinimumPeople = packagesWithMaxTime.Max(p => p.MinimumPeople);

            // מסננים רק את החבילות עם ה-MinimumPeople הגבוה ביותר
            var bestPackages = packagesWithMaxTime
                .Where(p => p.MinimumPeople == maxMinimumPeople)
                .ToList();

            return bestPackages;
        }
    }
}
