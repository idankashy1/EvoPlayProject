using System.Threading.Tasks;

namespace EvoPlay.BL.Contract
{
    public interface IEmailBL
    {
        Task SendPasswordResetEmailAsync(string toEmail, string resetLink);
    }
}