using EvoPlay.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.Repository.Contract
{
    public interface IUserRepository
    {
        Task AddUserAsync(User user);
        Task<User> UpdateUserAsync(User userToUpdate);
        Task<User> DeleteUserAsync(int userId);
        Task<User> GetUserByIdAsync(int userId);
        Task<List<User>> GetAllUsersAsync();
        Task<bool> CheckUserExistsByEmailAsync(string email);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByPhoneNumberAsync(string phoneNumber);
        Task<User> GetUserByResetTokenAsync(string token);


    }
}
