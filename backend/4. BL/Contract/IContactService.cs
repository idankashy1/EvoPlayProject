using EvoPlay.Dtos;

namespace EvoPlay.BL.Contract
{
    public interface IContactService
    {
        Task SendContactEmailAsync(ContactDto contactDto);
    }
}