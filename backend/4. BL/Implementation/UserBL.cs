using EvoPlay.BL.Contract;
using EvoPlay.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.BL.Implementation
{
    public class UserBL : IUserBL
    {
        private readonly IGenericRepository<User> _userRepository;

        public UserBL(IGenericRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            return await _userRepository.AddAsync(user);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task UpdateUserAsync(User user)
        {
            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user != null)
            {
                await _userRepository.DeleteAsync(user);
            }
        }
    }
}
