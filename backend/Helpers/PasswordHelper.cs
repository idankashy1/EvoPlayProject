using BCrypt.Net;
using System.Security.Cryptography;

namespace EvoPlay.Helpers
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
        public static string GenerateSecretKey()
        {
            using (var hmac = new HMACSHA256())
            {
                return Convert.ToBase64String(hmac.Key);
            }
        }
    }
}
