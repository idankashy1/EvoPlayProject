// Repo/Contract/IPackageRepository.cs
using EvoPlay.Entities;
using System.Collections.Generic;

namespace EvoPlay.DAL.Contract
{
    public interface IPackageRepository
    {
        IEnumerable<Package> GetAllPackages();
        IEnumerable<Package> GetAvailablePackages(int numberOfPlayers, int duration);
    }
}
