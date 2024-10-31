using EvoPlay.BL.Contract;
using EvoPlay.Dtos;
using EvoPlay.Entities;
using Microsoft.AspNetCore.Mvc;

namespace EvoPlay.Controllers
{
    [Route("api/packages")]
    [ApiController]
    public class PackagesController : ControllerBase
    {
        private readonly IPackageService _packageService;

        public PackagesController(IPackageService packageService)
        {
            _packageService = packageService;
        }

        [HttpGet("all")]
        public IActionResult GetAllPackages()
        {
            var packages = _packageService.GetAllPackages();
            return Ok(packages);
        }

        [HttpGet("available")]
        public IActionResult GetAvailablePackages([FromQuery] int NumberOfPlayers, [FromQuery] int Duration, [FromQuery] string RoomType)
        {
            // בודקים אם סוג החדר הוא PS5, PS5VIP או PC
            if (RoomType != "PS5" && RoomType != "PS5VIP" && RoomType != "PC")
            {
                return Ok(new List<Package>()); // מחזירים רשימה ריקה
            }

            var availablePackages = _packageService.GetAvailablePackages(NumberOfPlayers, Duration);
            return Ok(availablePackages);
        }
    }
}
