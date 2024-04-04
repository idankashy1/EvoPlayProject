using EvoPlay.Dtos;

namespace EvoPlay.Repository.Contract
{
    public interface IEmailRepository
    {
        Task SendEmailAsync(ContactDto contactDto);
    }
}