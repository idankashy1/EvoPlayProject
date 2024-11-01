using Microsoft.AspNetCore.Mvc;
using EvoPlay.Entities;
using EvoPlay.BL.Contract;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace EvoPlay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserBL _userBL;

        public UsersController(IUserBL userBL)
        {
            _userBL = userBL;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _userBL.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _userBL.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            var createdUser = await _userBL.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            await _userBL.UpdateUserAsync(user);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userBL.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await _userBL.DeleteUserAsync(id);

            return NoContent();
        }
        [HttpGet("exists")]
        public async Task<ActionResult> CheckUserExists([FromQuery] string email)
        {
            var user = await _userBL.GetUserByEmailAsync(email);
            if (user != null)
            {
                // User exists, return user ID
                return Ok(new { Exists = true, UserId = user.Id });
            }
            else
            {
                // User does not exist
                return Ok(new { Exists = false });
            }
        }
        [HttpPost("redeem-reward")]
        [Authorize]
        public async Task<IActionResult> RedeemReward()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim);
            var user = await _userBL.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.AvailableRewards <= 0)
            {
                return BadRequest("No available rewards to redeem.");
            }

            user.AvailableRewards -= 1;
            await _userBL.UpdateUserAsync(user);

            return Ok("Reward redeemed successfully.");
        }
    }
}
