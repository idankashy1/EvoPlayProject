using EvoPlay.DTOs;
using EvoPlay.BL.Contract;
using EvoPlay.Entities;
using EvoPlay.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;


namespace EvoPlay._5._Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserBL _userBL; // Assuming you have a business logic layer for user operations
        private readonly IConfiguration _configuration;
        private readonly IEmailBL _emailBL;


        public AuthController(IUserBL userBL, IConfiguration configuration, IEmailBL emailBL)
        {
            _userBL = userBL;
            _configuration = configuration;
            _emailBL = emailBL;
        }

        [HttpGet("hashpassword")]
        public ActionResult<string> GetHashedPassword(string password)
        {
            return PasswordHelper.HashPassword(password);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userBL.Authenticate(loginDto.Email, loginDto.Password);
            if (user == null) return Unauthorized("Invalid credentials.");

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationDto registrationDto)
        {
            if (await _userBL.CheckUserExistsByEmailAsync(registrationDto.Email))
            {
                return BadRequest("User already exists.");
            }

            var user = new User
            {
                FirstName = registrationDto.FirstName,
                LastName = registrationDto.LastName,
                Email = registrationDto.Email,
                PasswordHash = PasswordHelper.HashPassword(registrationDto.Password),
                PhoneNumber = registrationDto.PhoneNumber,
                City = registrationDto.City,
                Address = registrationDto.Address,
                TotalPoints = 0,
                AvailableRewards = 0
            };

            await _userBL.CreateUserAsync(user);

            return Ok("User registered successfully.");
        }


        private string GenerateJwtToken(User user)
        {
            // Decode the base64 string to a byte array
            var keyBytes = Convert.FromBase64String(_configuration["Jwt:Key"]);
            var key = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
    };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userBL.GetUserByEmailAsync(forgotPasswordDto.Email);
            if (user == null) return NotFound("User not found");

            // יצירת טוקן איפוס סיסמה
            user.PasswordResetToken = Guid.NewGuid().ToString();
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);
            await _userBL.UpdateUserAsync(user);

            var resetLink = $"https://yourfrontend.com/reset-password?token={user.PasswordResetToken}";
            await _emailBL.SendPasswordResetEmailAsync(user.Email, resetLink);

            return Ok("Password reset link sent");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var user = await _userBL.GetUserByResetTokenAsync(resetPasswordDto.Token);
            if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest("Invalid or expired token.");
            }

            user.PasswordHash = PasswordHelper.HashPassword(resetPasswordDto.NewPassword);
            user.PasswordResetToken = null;
            user.ResetTokenExpiry = null;
            await _userBL.UpdateUserAsync(user);

            return Ok("Password has been reset successfully.");
        }
    }

}
