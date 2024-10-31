using EvoPlay.BL.Contract;
using EvoPlay.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace EvoPlay._5._Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        public async Task<IActionResult> SendContactEmail(ContactDto contactDto)
        {
            await _contactService.SendContactEmailAsync(contactDto);
            return Ok();
        }
    }
}
