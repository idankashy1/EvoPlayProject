using EvoPlay.BL.Contract;
using EvoPlay.Dtos;
using EvoPlay.Repository.Contract; // Assuming the ContactDto is placed appropriately

namespace EvoPlay.BL.Implementation
{
    public class ContactService : IContactService
    {
        private readonly IEmailRepository _emailRepository;

        public ContactService(IEmailRepository emailRepository)
        {
            _emailRepository = emailRepository;
        }

        public async Task SendContactEmailAsync(ContactDto contactDto)
        {
            // Logic to convert ContactDto to your Email entity or model
            // Call repository method to handle the email sending
            await _emailRepository.SendEmailAsync(contactDto);
        }
    }
}