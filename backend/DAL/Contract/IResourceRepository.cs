using EvoPlay.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.Repository.Contract
{
    public interface IResourceRepository
    {
        Task<List<Resource>> GetResourcesByTypeAsync(int resourceTypeId);
    }
}
