using EvoPlay.Entities;
using System.Collections.Generic;

namespace EvoPlay.BL.Contract
{
    public interface IPackageService
    {
        IEnumerable<Package> GetAllPackages();
        IEnumerable<Package> GetAvailablePackages(int numberOfPlayers, int duration);
    }
}