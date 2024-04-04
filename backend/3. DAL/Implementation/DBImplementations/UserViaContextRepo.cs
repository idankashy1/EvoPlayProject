using EvoPlay._3._Repository.Contract;
using EvoPlay.DAL;
using EvoPlay.Entities;
using Microsoft.EntityFrameworkCore;

namespace EvoPlay._3._Repository.Implementation
{
    public class UserViaContextRepo : IUserRepo
    {
        private readonly GameCenterContext _context;

        public UserViaContextRepo(GameCenterContext context) {
            _context = context;
        }

        public User AddUser(User userToAdd)
        {
            _context.Users.Add(userToAdd);
            return _context.Users.FirstOrDefault(u => u.Id == userToAdd.Id);
        }

        public User DeleteUser(int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            _context.Users.Remove(user);
            return user;
        }

        public List<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUser(int userId)
        {
            return _context.Users.FirstOrDefault(u => u.Id == userId);
        }

        public User UpdateUser(User userToUpdate)
        {
            var user = _context.Users.Update(userToUpdate);
            return _context.Users.FirstOrDefault(u => u.Id == userToUpdate.Id);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
