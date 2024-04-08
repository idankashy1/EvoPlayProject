using EvoPlay.Entities;

namespace EvoPlay._3._Repository.Contract
{
    public interface IUserRepo
    {
        User AddUser(User userToAdd);

        User UpdateUser(User userToUpdate);

        User DeleteUser(int userId);

        User GetUser(int userId);

        List<User> GetAllUsers();

        void SaveChanges();
        Task<bool> CheckUserExistsByEmailAsync(string email);
        Task<User> GetUserByEmailAsync(string email);
    }
}
