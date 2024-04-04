using EvoPlay.BL.Contract;
using EvoPlay.Dtos;
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
        public IActionResult GetAvailablePackages([FromQuery] BookingDetailsDto bookingDetails)
        {
            var availablePackages = _packageService.GetAvailablePackages(bookingDetails.NumberOfPlayers, bookingDetails.Duration);
            if (!availablePackages.Any())
            {
                return NotFound("No packages available for the given criteria.");
            }

            return Ok(availablePackages);
        }
    }
}
