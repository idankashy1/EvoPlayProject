using Microsoft.EntityFrameworkCore;
using EvoPlay.BL.Contract;
using EvoPlay.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using EvoPlay.Helpers;
using EvoPlay._2._DTOs;
using EvoPlay.Repository.Implementation;


namespace EvoPlay.BL.Implementation
{
    public class UserBL : IUserBL
    {
        private readonly IGenericRepository<User> _userRepository;

        public UserBL(IGenericRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> Authenticate(string email, string password)
        {
            // Call GetAllAsync and immediately await it, converting to a list for LINQ operations
            var users = await _userRepository.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Email == email);

            // After finding the user, we check the password
            if (user != null && user.PasswordHash != null)
            {
                // Trim the password hash to remove any extraneous whitespace characters
                string trimmedPasswordHash = user.PasswordHash.Trim();

                if (PasswordHelper.VerifyPassword(password, trimmedPasswordHash))
                {
                    return user;
                }
            }

            return null;
        }

        public async Task<User> RegisterUserAsync(RegistrationDto registrationDto)
        {
            var hashedPassword = PasswordHelper.HashPassword(registrationDto.Password);
            var user = new User
            {
                Email = registrationDto.Email,
                PasswordHash = hashedPassword
            };

            // Save the user to the database using your repository
            await _userRepository.AddAsync(user);

            return user; // or return a DTO or a status indicating success/failure
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
