using EvoPlay._2._DTOs;
using EvoPlay.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EvoPlay.BL.Contract
{
    public interface IUserBL
    {
        Task<User> Authenticate(string username, string password);
        Task<User> RegisterUserAsync(RegistrationDto registrationDto);

        Task<User> CreateUserAsync(User user);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(int id);
        Task<bool> CheckUserExistsByEmailAsync(string email);
        Task<User> GetUserByEmailAsync(string email);
    }
}